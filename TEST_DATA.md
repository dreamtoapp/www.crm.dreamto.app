# Test Data Documentation

This document describes the comprehensive fake data created by the seeding script for testing the DreamTo CRM application.

## 🚀 Quick Start

To populate your database with test data, run:

```bash
pnpm seed
```

## 📊 Database Summary

After seeding, your database will contain:

- **1 Admin user** (A789)
- **6 Designer users** (D100-D104, D999)
- **11 Client users** (C200-C209, C999)
- **8 Design Types** (Arabic names)
- **68 Images** (50 regular + 18 test scenarios)
- **100 Comments** (distributed across images)

## 👥 User Credentials

### Admin
- **Identifier**: `A789`
- **Name**: مدير النظام
- **Email**: admin@dreamto.app
- **Role**: ADMIN

### Designers
| Identifier | Name | Email | Role |
|------------|------|-------|------|
| D100 | أحمد محمد | designer1@dreamto.app | DESIGNER |
| D101 | فاطمة علي | designer2@dreamto.app | DESIGNER |
| D102 | عبدالله حسن | designer3@dreamto.app | DESIGNER |
| D103 | مريم أحمد | designer4@dreamto.app | DESIGNER |
| D104 | محمد علي | designer5@dreamto.app | DESIGNER |
| D999 | مصمم نشط | prolific@dreamto.app | DESIGNER |

### Clients
| Identifier | Name | Email | Role |
|------------|------|-------|------|
| C200 | سارة خالد | client1@dreamto.app | CLIENT |
| C201 | علي محمود | client2@dreamto.app | CLIENT |
| C202 | نور الدين | client3@dreamto.app | CLIENT |
| C203 | خديجة محمد | client4@dreamto.app | CLIENT |
| C204 | يوسف أحمد | client5@dreamto.app | CLIENT |
| C205 | زينب علي | client6@dreamto.app | CLIENT |
| C206 | عمر حسن | client7@dreamto.app | CLIENT |
| C207 | آمنة محمد | client8@dreamto.app | CLIENT |
| C208 | حسن علي | client9@dreamto.app | CLIENT |
| C209 | عائشة أحمد | client10@dreamto.app | CLIENT |
| C999 | عميل نشط | activeclient@dreamto.app | CLIENT |

## 🎨 Design Types

| Name (Arabic) | Description |
|---------------|-------------|
| تصميم داخلي | تصميمات للديكور الداخلي للمنازل والمكاتب |
| تصميم خارجي | تصميمات الواجهات الخارجية للمباني |
| تصميم أثاث | تصميم قطع الأثاث المخصصة |
| تصميم إضاءة | تصميم أنظمة الإضاءة والإنارة |
| تصميم حدائق | تصميم الحدائق والمساحات الخضراء |
| تصميم مطابخ | تصميم المطابخ الحديثة والكلاسيكية |
| تصميم حمامات | تصميم الحمامات والمرافق الصحية |
| تصميم غرف نوم | تصميم غرف النوم والغرف الشخصية |

## 🖼️ Image Data

### Regular Images (50 total)
- **Distribution**: Each designer has ~10 images
- **Formats**: JPG, PNG, WebP (rotating)
- **Sizes**: 800-1200px width, 600-900px height
- **File sizes**: 500KB - 1MB
- **URLs**: Working Picsum Photos placeholder images

### Test Scenario Images (18 total)

#### Prolific Designer (D999)
- **10 images** with consistent high-quality specs
- **Format**: JPG
- **Size**: 1200x800px
- **File size**: 800KB

#### Active Client (C999)
- **8 images** from various designers
- **Format**: PNG
- **Size**: 1000x700px
- **File size**: 600KB

## 💬 Comments

### Sample Comments (Arabic)
- تصميم رائع ومبتكر!
- أحب الألوان المستخدمة في هذا التصميم
- التفاصيل دقيقة ومميزة
- تصميم عصري وأنيق
- ممتاز! هذا بالضبط ما كنت أبحث عنه
- أقترح تعديل بسيط في الألوان
- التصميم عملي ومريح
- أداء ممتاز في هذا المشروع
- تصميم كلاسيكي جميل
- أفكار إبداعية ومبتكرة

### Distribution
- **100 comments** total
- Distributed across all images
- Authors include admin, designers, and clients
- Realistic engagement patterns

## 🧪 Testing Scenarios

### 1. Admin Dashboard Testing
- **User**: A789
- **Test**: View all users, images, and design types
- **Expected**: Full access to all data

### 2. Designer Portfolio Testing
- **Users**: D100-D104, D999
- **Test**: View uploaded images, client assignments
- **Expected**: See own images and client information

### 3. Client Gallery Testing
- **Users**: C200-C209, C999
- **Test**: View assigned images, leave comments
- **Expected**: See images assigned to them

### 4. Filtering and Search Testing
- **Test**: Filter by design type, client, designer
- **Data**: 8 design types, 11 clients, 6 designers
- **Expected**: Proper filtering results

### 5. Pagination Testing
- **Test**: Navigate through 68 images
- **Default**: 20 images per page
- **Expected**: 4 pages of results

### 6. Comment System Testing
- **Test**: Add, view, and manage comments
- **Data**: 100 existing comments
- **Expected**: Proper comment threading

### 7. Image Upload Testing
- **Test**: Upload new images with metadata
- **Required**: Designer ID, Client ID, Design Type ID
- **Expected**: Proper image creation and relationships

## 🔄 Resetting Data

To clear and reseed the database:

```bash
# Clear all data and reseed
pnpm seed
```

The seeding script automatically:
1. Deletes all existing data
2. Creates fresh test data
3. Maintains referential integrity
4. Provides consistent test scenarios

## 📈 Performance Testing

### Large Dataset Testing
For testing with larger datasets, you can modify the seed script:

```typescript
// Increase these numbers in prisma/seed.ts
const imageCount = 500; // Instead of 50
const commentCount = 1000; // Instead of 100
```

### Stress Testing
- **Images per designer**: 10-20 images
- **Comments per image**: 2-5 comments
- **Concurrent users**: Test with multiple browser sessions

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check your DATABASE_URL in .env
   # Ensure MongoDB is running
   ```

2. **Prisma Client Error**
   ```bash
   # Regenerate Prisma client
   npx prisma generate
   ```

3. **Seeding Fails**
   ```bash
   # Check for unique constraint violations
   # Ensure database is accessible
   ```

### Data Validation

After seeding, verify the data:

```bash
# Check user count
curl http://localhost:3000/api/users

# Check image count
curl http://localhost:3000/api/images

# Check design types
curl http://localhost:3000/api/design-types
```

## 📝 Notes

- All fake data uses realistic Arabic names and content
- Image URLs are working Picsum Photos placeholder images
- Comments are in Arabic to match the application's primary language
- Test scenarios include edge cases (prolific users, active clients)
- Data is designed to test all application features comprehensively 