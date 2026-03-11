import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const industryFilter = searchParams.get('industry')
    const format = searchParams.get('format') || 'csv'

    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch products with optional industry filter
    let query = supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (industryFilter && industryFilter !== 'all') {
      query = query.eq('industry_id', industryFilter)
    }

    const { data: products, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    if (format === 'csv') {
      // Generate CSV
      const headers = [
        'Name',
        'Brand',
        'Category',
        'Industry',
        'Confidence',
        'Workflow',
        'Story',
        'Features',
        'TrueMark ID',
        'Registered',
        'Created At',
      ]

      const csvRows = products.map((product: any) => [
        product.name || '',
        product.brand || '',
        product.category || '',
        (product.industry_id || '').replace('-', ' & '),
        product.confidence || '',
        product.workflow ? JSON.stringify(product.workflow) : '',
        product.story || '',
        product.features || '',
        product.truemark_id || '',
        product.is_registered ? 'Yes' : 'No',
        product.created_at || '',
      ])

      const csvContent = [
        headers.join(','),
        ...csvRows.map((row: any[]) =>
          row
            .map((cell) =>
              typeof cell === 'string' && cell.includes(',')
                ? `"${cell.replace(/"/g, '""')}"`
                : cell
            )
            .join(',')
        ),
      ].join('\n')

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="authichain-products-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    // Default to JSON
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
