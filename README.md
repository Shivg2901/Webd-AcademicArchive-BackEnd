
# Academic Submissions API

The **Academic Submissions API** is a platform that allows students to upload academic submissions (e.g., notes, question papers), while admins can manage these submissions (approve/reject). Additionally, students can search through approved submissions, assign categories, and comment on submissions.

## Features

- **User Authentication**: JWT-based authentication for secure access.
- **Admin Management**: Admins can approve, reject, or delete submissions.
- **Student Features**: Students can upload, categorize, and comment on submissions.
- **Search**: Search functionality for finding approved submissions by title, description, or category.

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Shivg2901/Webd-AcademicArchive-BackEnd.git
cd Webd-AcademicArchive-BackEnd
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Populate the `.env` file with reference to `.env.example`.

### 4. Run Prisma Migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the Development Server

```bash
tsc -b
node dist/index.js
```

### 6. Informal API Flowchart Link

```
https://app.creately.com/d/5wrGddJlDfj/edit
```
