# Data Management Documentation - ArthaPath Nepal

## Table of Contents
1. [Investment Categories Data Seeding](#investment-categories-data-seeding)
2. [Data Verification Process](#data-verification-process)
3. [Data Validation Rules](#data-validation-rules)
4. [Audit Trail System](#audit-trail-system)
5. [Maintenance Procedures](#maintenance-procedures)

---

## Investment Categories Data Seeding

### Overview
Investment categories are automatically seeded into the database on application startup if the database is empty. This ensures the application always has the core investment data available for calculations and recommendations.

### Seeding Mechanism
- **Trigger**: Automatic on module initialization (`OnModuleInit` lifecycle hook)
- **Condition**: Only seeds if `investment_categories` table is empty (count = 0)
- **Location**: `backend/src/investment-category/investment-category.service.ts`
- **Method**: `seedCategoriesIfEmpty()`

### Investment Categories Data

#### 1. Stocks
- **Type**: Stocks
- **Expected Return**: 10% - 20%
- **Risk Level**: High
- **Liquidity Score**: 8/10
- **Lock-in Period**: None
- **Minimum Capital**: NPR 5,000
- **Description**: Equity investment in listed companies with high growth potential and higher volatility.

#### 2. Mutual Funds
- **Type**: Mutual Fund
- **Expected Return**: 8% - 15%
- **Risk Level**: Medium
- **Liquidity Score**: 7/10
- **Lock-in Period**: None to 3 years
- **Minimum Capital**: NPR 1,000
- **Description**: Professionally managed pooled investments suitable for diversification and gradual wealth building.

#### 3. Bonds
- **Type**: Bond
- **Expected Return**: 6% - 10%
- **Risk Level**: Low
- **Liquidity Score**: 6/10
- **Lock-in Period**: 1 to 5 years
- **Minimum Capital**: NPR 10,000
- **Description**: Fixed-income instruments offering relatively stable returns and lower risk than equities.

#### 4. Fixed Deposit (FD)
- **Type**: FD
- **Expected Return**: 5% - 8%
- **Risk Level**: Low
- **Liquidity Score**: 4/10
- **Lock-in Period**: 3 months to 5 years
- **Minimum Capital**: NPR 1,000
- **Description**: Bank deposit product with historically stable returns over a fixed tenure and relatively low capital risk.

#### 5. Gold
- **Type**: Gold
- **Expected Return**: 4% - 12%
- **Risk Level**: Medium
- **Liquidity Score**: 7/10
- **Lock-in Period**: None
- **Minimum Capital**: NPR 5,000
- **Description**: Traditional inflation-hedging asset that provides portfolio stability during market uncertainty.

#### 6. Real Estate
- **Type**: Real Estate
- **Expected Return**: 7% - 14%
- **Risk Level**: Medium
- **Liquidity Score**: 3/10
- **Lock-in Period**: 5+ years
- **Minimum Capital**: NPR 500,000
- **Description**: Property-based investment with long-term appreciation potential but lower liquidity.

#### 7. Business
- **Type**: Business
- **Expected Return**: 12% - 30%
- **Risk Level**: High
- **Liquidity Score**: 2/10
- **Lock-in Period**: 5+ years
- **Minimum Capital**: NPR 100,000
- **Description**: Direct ownership or participation in business ventures with potentially high but uncertain returns.

---

## Data Verification Process

### Manual Verification Script
Run the data verification script to check database integrity:

```bash
cd backend
npm run verify:data
```

### What Gets Verified
1. **Investment Categories Count**: Ensures all 7 categories exist
2. **Data Consistency**: Validates all required fields are populated
3. **Range Validation**: Checks return ranges, liquidity scores, and capital requirements
4. **Risk Level Distribution**: Confirms balanced risk distribution (Low/Medium/High)
5. **Duplicate Detection**: Identifies duplicate category names or types

### Expected Output
```
✓ Database connection successful
✓ Found 7 investment categories
✓ All categories have valid data
✓ Risk level distribution: Low (2), Medium (3), High (2)
✓ No duplicates detected
✓ Data verification complete
```

---

## Data Validation Rules

### Investment Category Validation

#### Field Constraints
- **name**: Required, unique, 2-100 characters
- **type**: Required, must match category name
- **expected_return_min**: Required, 0-100%, must be ≤ expected_return_max
- **expected_return_max**: Required, 0-100%, must be ≥ expected_return_min
- **risk_level**: Required, enum: ['Low', 'Medium', 'High']
- **liquidity_score**: Required, 0-10 scale
- **lock_in_period**: Required, descriptive string
- **minimum_capital**: Required, ≥ 0
- **description**: Required, 10-500 characters

#### Business Rules
1. **Return Range Logic**: Min return must be less than or equal to max return
2. **Risk-Return Correlation**: High-risk categories should have higher potential returns
3. **Liquidity-Capital Relationship**: Higher minimum capital typically correlates with lower liquidity
4. **Lock-in Period Consistency**: Should align with liquidity score

### Admin Edit Validation
When admins modify categories via the admin panel:
1. DTOs validate all input fields (`CreateInvestmentCategoryDto`, `UpdateInvestmentCategoryDto`)
2. Database constraints prevent invalid data
3. Changes are logged in the audit trail

---

## Audit Trail System

### Purpose
Track all modifications to investment categories to maintain data integrity and accountability.

### What Gets Logged
- **Action Type**: CREATE, UPDATE, DELETE
- **Entity**: investment_category
- **Entity ID**: UUID of the category
- **User ID**: Admin who performed the action
- **Timestamp**: When the action occurred
- **Old Values**: Previous data (for updates)
- **New Values**: Updated data (for updates)
- **IP Address**: Source of the request
- **User Agent**: Browser/client information

### Audit Log Schema
```typescript
{
  id: string;
  entity_type: 'investment_category';
  entity_id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  user_id: string;
  user_email: string;
  old_values: object | null;
  new_values: object | null;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}
```

### Accessing Audit Logs
Audit logs are available via the Admin Dashboard:
1. Navigate to Admin Panel → Categories
2. Click "View History" for any category
3. See complete change history with user attribution

### Retention Policy
- Audit logs are retained **indefinitely** for compliance
- Logs older than 2 years are archived (future implementation)
- No automatic deletion of audit records

---

## Maintenance Procedures

### Adding New Investment Categories
1. Create category via Admin Panel UI (preferred method)
2. Or manually insert via SQL with proper validation
3. Verify data integrity using verification script
4. Confirm audit log entry was created

### Updating Investment Categories
1. Use Admin Panel for all updates (ensures audit trail)
2. Never update directly via SQL in production
3. Review change history after updates
4. Verify calculations still work correctly

### Data Backup Recommendations
1. **Daily backups**: Automated PostgreSQL backups
2. **Pre-update snapshot**: Before major data changes
3. **Version control**: Keep data seed file in Git
4. **Test environment**: Test changes in staging first

### Handling Data Corruption
1. Stop the backend application
2. Run data verification script to identify issues
3. Restore from latest backup if necessary
4. Re-run seeding if database is empty: restart backend
5. Verify all 7 categories exist after recovery

### Updating Return Rate Assumptions
Return rates should be reviewed quarterly based on:
- Nepal market performance data
- Economic indicators
- Inflation rates
- Expert input from financial advisors

**Process:**
1. Gather market data for last quarter
2. Update expected return ranges in seed data
3. Test in staging environment
4. Deploy to production
5. Document changes in version control

---

## Data Sources & References

### Return Rate Assumptions
- Based on historical Nepal Stock Exchange (NEPSE) data
- Nepal Rastra Bank deposit rate guidelines
- Real estate appreciation trends in Kathmandu Valley
- Gold price trends in Nepal market

### Validation Criteria
- Securities Board of Nepal (SEBON) regulations
- Nepal Rastra Bank guidelines for deposits
- Industry best practices for investment classification

### Review Schedule
- **Monthly**: Check for any data anomalies
- **Quarterly**: Review return rate assumptions
- **Annually**: Comprehensive data audit
- **As needed**: After major market events

---

## Troubleshooting

### Issue: Categories Not Seeding
**Symptom**: Database empty, no categories visible

**Solution**:
1. Check database connection
2. Verify `investment_categories` table exists
3. Restart backend to trigger seeding
4. Check backend logs for errors

### Issue: Duplicate Categories
**Symptom**: Multiple entries with same name

**Solution**:
1. Run verification script to identify duplicates
2. Delete duplicate entries via Admin Panel
3. Database unique constraint should prevent this

### Issue: Invalid Data Ranges
**Symptom**: Min return > Max return, or liquidity > 10

**Solution**:
1. Run validation checks
2. Correct via Admin Panel
3. Review who made the change (audit log)

---

## Security Considerations

### Access Control
- Only ADMIN role can modify investment categories
- All modifications require authentication
- IP addresses are logged for security audit

### Data Integrity
- Database constraints enforce data validity
- Application-level validation prevents invalid input
- Audit trail maintains complete change history

### Compliance
- No personal user data stored in investment categories
- Public data only (market information)
- Complies with Nepal data protection guidelines

---

## Contact & Support

For questions about data management:
- Review this document first
- Check audit logs for change history
- Run verification script for data issues
- Contact development team for system issues

**Last Updated**: March 5, 2026
**Document Version**: 1.0
**Maintained By**: ArthaPath Development Team
