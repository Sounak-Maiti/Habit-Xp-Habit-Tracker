# 🎯 Habit Tracker

A modern, fully-functional web application that replicates Google Sheets-style habit tracking with a beautiful SaaS interface.

## ✨ Features

### 📊 Core Functionality
- **Dynamic Calendar System**: Year/month selection with automatic leap year handling
- **Spreadsheet-like Grid**: Clickable cells with week grouping (Week 1-5)
- **Real-time Calculations**: All stats update instantly as you track habits
- **Data Persistence**: Automatic localStorage saving

### 📈 Analytics & Visualization
- **Dashboard**: Key metrics (Completed, Left, Target) with monthly progress bars
- **Habit Stats Table**: Detailed performance with progress bars and streak tracking
- **Weekly Progress**: Dynamic weekly totals and completion percentages
- **GitHub-style Heatmap**: Visual consistency tracking with insights
- **Streak Tracking**: Current and best streak calculations

### 🎯 Goals Management
- **CRUD Operations**: Add, edit, delete long-term goals
- **Categories**: Academic, Fitness, Personal, Career
- **Target Dates**: Set deadlines for your goals

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop and mobile
- **Smooth Animations**: Framer Motion throughout the interface
- **Clean SaaS Design**: Purple/blue gradient theme with modern aesthetics
- **Interactive Elements**: Hover states, transitions, and micro-interactions

## 🛠 Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety throughout the application
- **Tailwind CSS** - Modern styling with custom animations
- **Zustand** - Lightweight state management with persistence
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon set
- **date-fns** - Robust date handling utilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd "Habit Tracker 1\habit-tracker"
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 How to Use

### 1. **Navigate Time**
- Use the calendar header to switch between months and years (2023-2030)
- The system automatically adjusts days per month (handles leap years)

### 2. **Track Habits**
- Click any cell in the habit grid to mark complete/incomplete
- Visual feedback with smooth animations
- Current day highlighted with purple ring

### 3. **Manage Habits**
- Click "Add New Habit" to create custom habits
- Use the trash icon to remove habits
- Habits are color-coded for easy identification

### 4. **View Progress**
- **Dashboard**: Overview metrics and monthly progress visualization
- **Stats Table**: Detailed performance data for each habit
- **Weekly Progress**: Week-by-week completion rates
- **Heatmap**: Visual consistency patterns over the month

### 5. **Set Goals**
- Add long-term goals in the sidebar
- Categorize goals (Academic, Fitness, Personal, Career)
- Set target dates for accountability

## 🎯 Key Features Explained

### **Spreadsheet Grid**
- Rows represent habits
- Columns represent days (1-31 depending on month)
- Weeks are visually grouped
- Click cells to toggle completion status

### **Real-time Calculations**
- All statistics update immediately
- Progress bars animate smoothly
- Percentages calculated automatically

### **Data Persistence**
- Everything saves to localStorage automatically
- No backend required
- Data persists between browser sessions

## 📂 Project Structure

```
src/
├── app/
│   └── page.tsx              # Main application page
├── components/
│   ├── Dashboard.tsx          # Metrics dashboard
│   ├── CalendarHeader.tsx      # Date navigation
│   ├── HabitGrid.tsx          # Main habit tracking grid
│   ├── HabitStats.tsx          # Statistics table
│   ├── WeeklyProgress.tsx      # Weekly progress cards
│   ├── GoalsPanel.tsx         # Goals management
│   └── Heatmap.tsx            # Consistency heatmap
├── store/
│   └── habitStore.ts          # Zustand state management
└── utils/
    └── calendar.ts             # Date utilities
```

## 🔧 Customization

### **Adding New Features**
- State management in `src/store/habitStore.ts`
- Components in `src/components/`
- Utilities in `src/utils/calendar.ts`

### **Styling**
- Tailwind CSS configuration in `tailwind.config.ts`
- Custom animations and colors defined there

## 🚀 Production Deployment

### **Build for Production**
```bash
npm run build
npm start
```

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel (LIVE)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

TRY OUT THE LIVE SITE: https://habit-xp-henna.vercel.app/

NOTE THAT THIS SITE IS ENHANCED USING WINDSURF AI AGENT ALONG WITH DEVELOPER CODING.
