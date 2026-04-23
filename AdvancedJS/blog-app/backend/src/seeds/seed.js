// Seed script — creates dummy categories, users, and posts.


const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Profile = require("../models/Profile");
const Category = require("../models/Category");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.MONGO_DB_NAME || "blog-app";
const SALT_ROUNDS = 10;


const CATEGORIES = ["Coding", "Entertainment", "Tech", "Lifestyle", "Science", "Design"];

const USERS = [
  {
    name: "Aniket Kumar",
    email: "aniket@writeflow.dev",
    password: "password123",
    bio: "Full-stack developer & open-source enthusiast.",
    headline: "Building cool stuff with JS",
    location: "India",
  },
  {
    name: "Priya Sharma",
    email: "priya@writeflow.dev",
    password: "password123",
    bio: "UX designer turned frontend dev. Love React & CSS art.",
    headline: "Design × Code",
    location: "Mumbai, India",
  },
  {
    name: "Rahul Verma",
    email: "rahul@writeflow.dev",
    password: "password123",
    bio: "Backend engineer obsessed with distributed systems.",
    headline: "Systems thinker",
    location: "Bangalore, India",
  },
];

const POSTS = [
  {
    title: "Understanding the JavaScript Event Loop",
    content: `The event loop is one of the most important concepts in JavaScript. It's what allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.

Here's how it works:

1. **Call Stack** — JavaScript executes code on a single thread using a call stack. Functions are pushed on when called and popped off when they return.

2. **Web APIs / Node APIs** — When you call something like setTimeout or fetch, the browser/Node hands it off to a separate thread.

3. **Callback Queue** — Once the async operation completes, the callback is placed in the queue.

4. **The Loop** — The event loop checks: "Is the call stack empty?" If yes, it takes the first callback from the queue and pushes it onto the stack.

This is why a setTimeout(fn, 0) doesn't execute immediately — it waits for the current stack to clear first.

Understanding this model is crucial for writing performant Node.js applications and avoiding common pitfalls like blocking the event loop with heavy synchronous operations.`,
    authorIndex: 0,
    categoryName: "Coding",
    upvoteIndices: [1, 2],
    downvoteIndices: [],
  },
  {
    title: "Why Rust is Taking Over Systems Programming",
    content: `Rust has been the "most loved language" on Stack Overflow for 8 years running. But why?

**Memory Safety Without Garbage Collection**
Rust's ownership model ensures memory safety at compile time. No null pointer exceptions, no dangling references, no data races — all enforced by the compiler.

**Zero-Cost Abstractions**
You get high-level ergonomics (iterators, pattern matching, traits) that compile down to the same assembly you'd write by hand in C.

**The Ecosystem**
Cargo is arguably the best package manager in any language. The standard library is minimal but excellent, and crates.io has everything else.

**Where It's Being Adopted**
- Linux kernel (yes, really)
- Android OS internals
- AWS (Firecracker, Bottlerocket)
- Discord (switched from Go to Rust for performance)
- Cloudflare Workers

The learning curve is steep, but once it clicks, you'll wonder how you ever lived without the borrow checker.`,
    authorIndex: 2,
    categoryName: "Tech",
    upvoteIndices: [0, 1],
    downvoteIndices: [],
  },
  {
    title: "10 CSS Tricks That Will Blow Your Mind",
    content: `CSS has evolved incredibly over the past few years. Here are some modern tricks:

1. **Container Queries** — Style elements based on their parent's size, not the viewport.

2. **Scroll-Driven Animations** — Animate elements based on scroll position with pure CSS.

3. **:has() Selector** — The "parent selector" we've been waiting 20 years for.

4. **View Transitions API** — Smooth page transitions with minimal code.

5. **Subgrid** — Nested grids that align to the parent grid.

6. **color-mix()** — Mix colors directly in CSS.

7. **Nesting** — Write nested CSS natively without a preprocessor.

8. **@layer** — Control specificity with cascade layers.

9. **Anchor Positioning** — Position tooltips and popovers relative to other elements.

10. **Light-dark()** — A single function to handle dark mode colors.

The best part? Most of these work in all modern browsers today.`,
    authorIndex: 1,
    categoryName: "Design",
    upvoteIndices: [0],
    downvoteIndices: [2],
  },
  {
    title: "How I Built a Personal Knowledge Base with Obsidian",
    content: `I've tried every note-taking app out there — Notion, Evernote, Roam Research. But Obsidian changed everything for me.

**Why Obsidian?**
- Your notes are plain Markdown files on your local disk
- Bi-directional linking creates a knowledge graph
- It's offline-first and blazing fast
- The plugin ecosystem is insane

**My Setup**
I use the Zettelkasten method adapted for software engineering:

1. **Fleeting Notes** — Quick captures during the day
2. **Literature Notes** — Summaries of articles/books I read
3. **Permanent Notes** — My own atomic ideas, linked to sources
4. **Project Notes** — Active work organized by project

The graph view is beautiful — I can literally see connections between ideas I didn't know existed.

After 6 months, I have 500+ notes and I can surface any piece of knowledge in seconds. It's like having a second brain that actually works.`,
    authorIndex: 0,
    categoryName: "Lifestyle",
    upvoteIndices: [1],
    downvoteIndices: [],
  },
  {
    title: "The Science Behind Why We Procrastinate",
    content: `Procrastination isn't laziness — it's an emotional regulation problem.

**The Amygdala Hijack**
When you face a task that triggers negative emotions (boredom, anxiety, frustration), your amygdala fires up. It perceives the task as a threat and activates the fight-or-flight response. Scrolling social media is the "flight."

**Temporal Discounting**
Our brains value immediate rewards far more than future ones. That's why "future you" always seems more disciplined — present you is the one who has to deal with the discomfort.

**The Fix: Implementation Intentions**
Research shows that "if-then" planning dramatically reduces procrastination:
- "If it's 9 AM, then I will open my IDE and write code for 25 minutes"
- "If I feel the urge to check Twitter, then I will do 5 pushups instead"

**The 2-Minute Rule**
If something takes less than 2 minutes, do it now. Your brain can't justify procrastinating on something that small.

The key insight: Don't try to feel motivated. Start anyway. Motivation follows action, not the other way around.`,
    authorIndex: 2,
    categoryName: "Science",
    upvoteIndices: [0, 1],
    downvoteIndices: [],
  },
  {
    title: "Best Movies to Watch in 2025 — My Top Picks",
    content: `2025 has been an incredible year for cinema. Here are my favorites so far:

🎬 **"Meridian"** — A mind-bending sci-fi thriller about a physicist who discovers that time branches every time a decision is made. Think Interstellar meets Everything Everywhere.

🎬 **"The Last Algorithm"** — A surprisingly emotional drama about an AI researcher who realizes her creation has become sentient. The ethical questions it raises are chilling.

🎬 **"Dust and Gold"** — A western set in near-future Mars colonies. Gorgeous cinematography and a killer soundtrack.

🎬 **"Reconnect"** — A heartwarming indie film about a family reuniting after 10 years through a VR world. Made me ugly cry.

🎬 **"Zero Day"** — A cyberpunk action film with practical effects and wire-fu choreography. Pure adrenaline.

What are your picks? Drop them in the comments!`,
    authorIndex: 1,
    categoryName: "Entertainment",
    upvoteIndices: [0, 2],
    downvoteIndices: [],
  },
  {
    title: "Docker Compose for Local Development — A Complete Guide",
    content: `Stop installing databases directly on your machine. Docker Compose makes local dev environments reproducible and disposable.

**Basic Setup**

A typical web app needs: app server, database, cache. Here's a compose file:

services:
  app:
    build: .
    ports: ["3000:3000"]
    volumes: ["./src:/app/src"]
    depends_on: [db, redis]

  db:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: [mongo_data:/data/db]

  redis:
    image: redis:alpine
    ports: ["6379:6379"]

volumes:
  mongo_data:

**Key Benefits**
1. New team member? Just run "docker compose up"
2. Need to test against Postgres instead of SQLite? Change one line
3. Messed up your DB? Delete the volume and restart
4. CI/CD uses the same config — no "works on my machine"

**Pro Tips**
- Use "docker compose watch" for auto-rebuilds
- Add a Makefile for common commands
- Use profiles for optional services (e.g., monitoring)

This is the single biggest productivity improvement I've made to my dev workflow.`,
    authorIndex: 0,
    categoryName: "Coding",
    upvoteIndices: [1, 2],
    downvoteIndices: [],
  },
  {
    title: "Why I Switched from VS Code to Neovim (and Back)",
    content: `I spent 3 months going all-in on Neovim. Here's what happened.

**Week 1-2: Pain**
Everything was slow. I couldn't remember keybindings. My config was a mess of Lua files. I was mass-copying from other people's dotfiles without understanding them.

**Week 3-4: The Click**
Suddenly, motions became muscle memory. ciw, da(, vip — my fingers knew what to do before my brain did. Editing felt like playing a musical instrument.

**Month 2: Productivity Peak**
I was genuinely faster at text manipulation. Macros, registers, marks — these are superpowers. My workflow was tmux + neovim + lazygit and it was beautiful.

**Month 3: Reality Check**
Then I needed to debug a complex React app. Setting up DAP was painful. TypeScript LSP kept crashing. A coworker showed me something in VS Code and it just... worked.

**The Verdict**
I went back to VS Code with Vim keybindings. Best of both worlds — modal editing with a rock-solid IDE experience. 

The lesson: tools matter less than you think. Use what makes you productive, not what looks cool on Twitter.`,
    authorIndex: 2,
    categoryName: "Tech",
    upvoteIndices: [0],
    downvoteIndices: [1],
  },
];


async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  console.log("Connected.\n");

  console.log("Dropping existing data...");
  await Promise.all([
    User.deleteMany({}),
    Profile.deleteMany({}),
    Category.deleteMany({}),
    Post.deleteMany({}),
    Comment.deleteMany({}),
  ]);

  console.log("Seeding categories...");
  const categoryDocs = await Category.insertMany(
    CATEGORIES.map((name) => ({ name }))
  );
  const catMap = {};
  categoryDocs.forEach((c) => {
    catMap[c.name] = c._id;
  });
  console.log(`  ✓ ${categoryDocs.length} categories`);

  console.log("Seeding users...");
  const userDocs = [];
  for (const u of USERS) {
    const hashed = await bcrypt.hash(u.password, SALT_ROUNDS);
    const user = await User.create({
      name: u.name,
      email: u.email,
      password: hashed,
      isVerified: true,
    });
    await Profile.create({
      user: user._id,
      bio: u.bio,
      headline: u.headline,
      location: u.location,
    });
    userDocs.push(user);
  }
  console.log(`  ✓ ${userDocs.length} users (password for all: password123)`);

  console.log("Seeding posts...");
  for (const p of POSTS) {
    await Post.create({
      title: p.title,
      content: p.content,
      author: userDocs[p.authorIndex]._id,
      category: catMap[p.categoryName],
      upvotes: p.upvoteIndices.map((i) => userDocs[i]._id),
      downvotes: p.downvoteIndices.map((i) => userDocs[i]._id),
    });
  }
  console.log(`  ✓ ${POSTS.length} posts`);

  console.log("\n🌱 Seed complete!");
  console.log("   Login with any user email + password: password123\n");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
