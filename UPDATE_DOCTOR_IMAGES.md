# 📸 Update Doctor Images Guide

Quick guide to replace placeholder images with actual doctor photos.

---

## Current Images to Replace

There are **2 images** in the website:

1. **Hero Section Image** (Line 98 in `Home.jsx`)
   - Current: Placeholder doctor image
   - Recommended size: 600x700px
   - Location: Top right of homepage

2. **About Section Image** (Line 134 in `Home.jsx`)
   - Current: Placeholder clinic image
   - Recommended size: 600x500px
   - Location: About section

---

## Option 1: Use Image Hosting Service (Recommended)

### Step 1: Upload Images

Choose one of these FREE image hosting services:

#### A. ImgBB (Easiest)
1. Go to [imgbb.com](https://imgbb.com)
2. Click "Start uploading"
3. Upload doctor's photo
4. Copy the "Direct link" URL
5. Repeat for clinic photo

#### B. Cloudinary (Professional)
1. Sign up at [cloudinary.com](https://cloudinary.com) (free)
2. Upload images
3. Copy image URLs
4. Use the URLs in code

#### C. GitHub (If using GitHub)
1. Create `frontend/public/images` folder
2. Add images: `doctor.jpg` and `clinic.jpg`
3. Use relative URLs: `/images/doctor.jpg`

### Step 2: Update Code

Open `frontend/src/pages/Home.jsx` and replace:

**Line 98 (Hero Section):**
```jsx
// OLD:
src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=700&fit=crop"

// NEW:
src="YOUR_DOCTOR_IMAGE_URL_HERE"
```

**Line 134 (About Section):**
```jsx
// OLD:
src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=500&fit=crop"

// NEW:
src="YOUR_CLINIC_IMAGE_URL_HERE"
```

---

## Option 2: Use Local Images (Simpler for Development)

### Step 1: Add Images to Project

1. Create folder: `frontend/public/images/`
2. Add your images:
   - `frontend/public/images/doctor.jpg`
   - `frontend/public/images/clinic.jpg`

### Step 2: Update Code

**Line 98 (Hero Section):**
```jsx
src="/images/doctor.jpg"
```

**Line 134 (About Section):**
```jsx
src="/images/clinic.jpg"
```

---

## Image Requirements

### Doctor Photo (Hero Section):
- **Format:** JPG or PNG
- **Recommended Size:** 600x700px (portrait)
- **Max File Size:** 500KB (optimize if larger)
- **Style:** Professional, clear face, good lighting
- **Background:** Preferably plain or clinic setting

### Clinic Photo (About Section):
- **Format:** JPG or PNG
- **Recommended Size:** 600x500px (landscape)
- **Max File Size:** 500KB
- **Style:** Clean, professional clinic interior/exterior
- **Content:** Reception, consultation room, or building exterior

---

## Image Optimization (Important!)

Before uploading, optimize images to reduce file size:

### Online Tools (Free):
1. [TinyPNG](https://tinypng.com) - Best for PNG/JPG
2. [Squoosh](https://squoosh.app) - Google's image optimizer
3. [Compressor.io](https://compressor.io) - Simple and fast

### Why Optimize?
- ✅ Faster page load
- ✅ Better SEO
- ✅ Less bandwidth usage
- ✅ Better mobile experience

---

## Quick Update Script

I can help you update the images. Just provide:

1. **Doctor image URL** or file path
2. **Clinic image URL** or file path

Then I'll update the code for you!

---

## Testing After Update

1. Save the file
2. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)
3. Check both images load correctly
4. Test on mobile view
5. Verify images are clear and professional

---

## Troubleshooting

### Image not showing:
- Check URL is correct and accessible
- Verify image file exists in public folder
- Clear browser cache
- Check browser console for errors

### Image too large/slow:
- Optimize image using tools above
- Reduce dimensions if too large
- Convert to WebP format for better compression

### Image looks stretched:
- Check aspect ratio matches recommended size
- Adjust `object-cover` to `object-contain` if needed

---

## Example Code (Complete)

Here's what the updated code should look like:

```jsx
{/* Hero Section - Doctor Image */}
<div className="glass-strong rounded-3xl p-8 shadow-2xl">
  <img
    src="https://i.ibb.co/abc123/doctor.jpg"  // Your image URL
    alt="Dr. Sandeep Kumar"
    className="rounded-2xl w-full object-cover shadow-lg"
  />
</div>

{/* About Section - Clinic Image */}
<div className="glass-strong rounded-3xl p-8 shadow-xl">
  <img
    src="https://i.ibb.co/xyz789/clinic.jpg"  // Your image URL
    alt="Clinic"
    className="rounded-2xl w-full object-cover"
  />
</div>
```

---

## Ready to Update?

**Option A:** Provide me the image URLs and I'll update the code
**Option B:** Follow the steps above and update manually

Let me know when you have the images ready! 📸
