# راهنمای Deploy پروژه Trello Clone

## گزینه ۱: Vercel (توصیه می‌شود - رایگان و سریع)

### روش ۱: Deploy با GitHub

1. **آماده‌سازی پروژه:**
   - پروژه را در GitHub push کنید:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy روی Vercel:**
   - به سایت [vercel.com](https://vercel.com) بروید
   - با GitHub account خود وارد شوید
   - روی "Add New Project" کلیک کنید
   - Repository خود را انتخاب کنید
   - تنظیمات را به صورت پیش‌فرض نگه دارید (Next.js به صورت خودکار تشخیص داده می‌شود)
   - روی "Deploy" کلیک کنید
   - بعد از چند دقیقه، لینک دمو شما آماده است!

3. **دسترسی به لینک:**
   - Vercel به صورت خودکار یک لینک رایگان می‌دهد مانند: `your-project-name.vercel.app`
   - این لینک را می‌توانید با دیگران به اشتراک بگذارید

### روش ۲: Deploy با Vercel CLI (بدون GitHub)

```bash
# نصب Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# برای production
vercel --prod
```

---

## گزینه ۲: Netlify

### روش ۱: با GitHub

1. **پروژه را در GitHub push کنید** (همان مراحل بالا)

2. **Deploy روی Netlify:**
   - به [netlify.com](https://netlify.com) بروید
   - با GitHub وارد شوید
   - "Add new site" > "Import an existing project"
   - Repository خود را انتخاب کنید
   - تنظیمات Build:
     - **Build command:** `npm run build`
     - **Publish directory:** `.next`
   - "Deploy site" را کلیک کنید

### روش ۲: Drag & Drop

1. پروژه را build کنید:
```bash
npm run build
```

2. فولدر `.next` را در [app.netlify.com/drop](https://app.netlify.com/drop) بکشید و رها کنید

---

## گزینه ۳: GitHub Pages (برای Static Export)

اگر می‌خواهید از GitHub Pages استفاده کنید، باید Next.js را به static export تبدیل کنید:

```bash
# در next.config.ts تنظیمات را تغییر دهید
```

---

## نکات مهم:

✅ قبل از deploy، پروژه را تست کنید:
```bash
npm run build
npm start
```

✅ مطمئن شوید که همه dependencies در `package.json` موجود است

✅ فایل `.gitignore` را بررسی کنید تا فایل‌های اضافی push نشوند

✅ پس از deploy، لینک دمو خود را تست کنید

---

## به‌روزرسانی پروژه:

هر بار که تغییری در کد ایجاد می‌کنید:
- تغییرات را commit کنید
- به GitHub push کنید
- Vercel/Netlify به صورت خودکار rebuild می‌کند

