# Airtable Base Schema for Operations & Analytics

This document describes the structure of the **AuthiChain Operations** Airtable base. It outlines each table, its fields, and views as requested in issue #21.

## 1. Contracts

- **Contract Name** (single line text)
- **Address** (single line text)
- **Network** (single select: Sepolia, Base, Polygon, Mainnet)
- **Type** (single select: Token, FeeRouter, RewardsBudget, Staking, Campaign, Bridge)
- **Deployed At** (date)
- **Deployer** (single line text)
- **Status** (single select: Deployed, Verified, Audited, Active)
- **GitHub Commit** (URL)

## Conclusion

This schema establishes the foundational Airtable base for AuthiChain operations. It defines tables, fields and views to support contracts, brands, revenue metrics, fee flows, rewards logs, products and campaign pools. Future updates can extend this base as needed.

## 2. Brands

- **Brand Name** (single line text)
- **Email** (email)
- **Stripe Customer ID** (single line text)
- **Subscription Tier** (single select: Starter, Professional, Enterprise)
- **Staking Tier** (single select: None, Bronze, Silver, Gold, Platinum)
- **QRON Staked** (number)
- **Unit Cost Discount** (number)
- **Monthly Revenue** (currency)
- **Lifetime Value** (currency)
- **Status** (single select: Active, Churned, Trial)
- **Signup Date** (date)
- **Last Active** (date)
- **Products Count** (rollup from Products)

Views:
- Active Brands
- Churn Risk (last active > 30 days)
- Staking Tiers
- High LTV (> $10k)

## 3. Revenue Metrics

- **Date** (date)
- **Total Revenue** (currency)
- **New MRR** (currency)
- **Churned MRR** (currency)
- **Net MRR** (currency)
- **90‑Day Rolling Avg** (formula)
- **Active Subscriptions** (number)
- **New Brands** (number)

## 4. Fee Flows

- **Timestamp** (date)
- **Brand** (link to Brands)
- **Amount USD** (currency)
- **QRON Swapped** (number)
- **Burn Allocation** (number)
- **Security Allocation** (number)
- **AI Allocation** (number)
- **Treasury Allocation** (number)
- **Transaction Hash** (single line text)
- **Status** (single select: Pending, Confirmed, Failed)

## 5. Rewards Log

- **Timestamp** (date)
- **User Wallet** (single line text)
- **Reward Type** (single select: Scan, Truth Claim, Hotspot, Referral)
- **QRON Amount** (number)
- **Product** (link to Products)
- **Transaction Hash** (single line text)

## 6. Products

- **Product ID** (UUID)
- **Name** (single line text)
- **Brand** (link to Brands)
- **Industry** (single select)
- **AI Confidence** (number)
- **Workflow** (long text)
- **Story** (long text)
- **Features** (long text)
- **TrueMark ID** (single line text)
- **Blockchain TX** (single line text)
- **Verification Count** (number)
- **Created At** (date)

## 7. Campaign Pools

- **Campaign Name** (single line text)
- **Brand** (link to Brands)
- **Industry** (single select)
- **Pool Address** (single line text)
- **Target Raise** (currency)
- **Current Raise** (number – QRON)
- **Brand Contribution** (number)
- **Community Contribution** (number)
- **Status** (single select: Active, Funded, Closed)
- **Start Date** (date)
- **End Date** (date)

## 8. Deployments

- **Timestamp** (date)
- **Environment** (single select: Development, Staging, Production)
- **Version** (single line text)
- **Commit SHA** (single line text)
- **Deployer** (single line text)
- **Status** (single select: Success, Failed, Rolled Back)
- **Notes** (long text)

## 9. Support Tickets

- **Ticket ID** (single line text)
- **Brand** (link to Brands)
- **Subject** (single line text)
- **Status** (single select: Open, In Progress, Resolved, Closed)
- **Priority** (single select: Low, Medium, High, Critical)
- **Is Staker** (checkbox – auto from Brand staking tier)
- **Assigned To** (single line text)
- **Created At** (date)
- **Resolved At** (date)

## 10. On‑Chain Events

- **Timestamp** (date)
- **Event Type** (single select: Mint, Verify, Settle, Stake, Unstake)
- **Transaction Hash** (single line text)
- **Product** (link to Products)
- **User Wallet** (single line text)
- **Network** (single select)
- **Block Number** (number)
- **Gas Used** (number)

## Automations

- **Churn Risk Alert** – when a brand’s last active date is more than 30 days ago, send a Slack message to #customer‑success.
- **High‑Value Signup** – when a brand is created with tier “Enterprise”, send a Slack message to #sales.
- **Daily Revenue Summary** – every day at 9 AM, send a summary to the #finance channel.
- **Contract Deployment Log** – when a new contract record is created, send a notification to #dev‑deploys.

---

This schema provides a clear blueprint for building the Airtable base used to power AuthiChain’s operational analytics.
