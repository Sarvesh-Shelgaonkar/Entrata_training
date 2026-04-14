### 📌 Linux Commands

**Linux is the backbone of most DevOps environments.**
Linux is the most common OS used in DevOps, especially for deploying applications on servers.

Why it matters:
You’ll often use the command line to install packages, manage files, monitor services, and handle networking.
**Examples:**

* `ls` – List files
* `cd` – Change directory
* `pwd` – Print current path
* `mkdir`, `rm`, `cp`, `mv` – File management (Create, delete, move, copy files)
* `top`, `ps` , `kill` – View running processes (Process monitoring and management)
* `cat`,`less` – Read and search file content
* `grep`, `find` - 	Search within files or directories

---

### 📁 File System Hierarchy

Linux has a **standard folder structure** starting from `/` (root).


| Directory | Description                     |
| --------- | ------------------------------- |
| `/`       | Root directory                  |
| `/home`   | User home directories           |
| `/etc`    | System-wide configuration files |
| `/bin`    | Essential command binaries      |
| `/usr`    | User programs and libraries     |
| `/var`    | Logs, mail, spool files         |
| `/tmp`    | Temporary files                 |
| `/opt`    | Optional software packages      |


**Why it matters:**
Knowing where to find config files, logs, and installed software is crucial when debugging or deploying.

---

### 👥 User & Group Management

Managing users and groups ensures **secure access control** and **team collaboration** on Linux servers.
DevOps engineers often manage **user permissions and access**.

**Important Commands:**

| Command                   | Description                       |
| ------------------------- | --------------------------------- |
| `useradd`, `passwd`       | Add a new user and set password   |
| `groupadd`, `usermod -aG` | Create a group, add user to group |
| `id`, `groups`, `whoami`  | View user and group info          |
| `chmod`, `chown`, `chgrp` | Set permissions and ownership     |

💡 Helps manage **managing access rights (who can do what)** and **improving security** on the system.

---

### ⚙️ Systemd & Services

Modern Linux systems use **`systemd`** to manage background services (daemons).
**`systemd`** is the init system for many modern Linux distros(specific packaged version of the Linux operating system). 


| Command                     | Action                         |
| --------------------------- | ------------------------------ |
| `systemctl start nginx`     | Start the nginx service        |
| `systemctl stop sshd`       | Stop SSH service               |
| `systemctl restart apache2` | Restart a service              |
| `systemctl status docker`   | Check service status           |
| `systemctl enable httpd`    | Enable service on boot         |
| `systemctl disable mysql`   | Disable service from autostart |

**Why it matters:**
In DevOps, you’ll **deploy apps, start/stop services**, and ensure they **run automatically on boot**.

👉 Important for managing **web servers, Docker, cron jobs**, etc.

---

### 🐚 Shell Scripting Basics (`.sh` files, loops, conditionals)

Shell scripting helps **automate repetitive tasks** using **CLI**.

**Example features:**

* `.sh` files: Scripts saved with `.sh` extension
* **Loops:** `for`, `while` – Repeat tasks
* **Conditionals:** `if`, `elif`, `else` – Logic-based execution
* **Shebang**: First line `#!/bin/bash` tells the system to use bash
* **Variables**: Store values — `name="Keziah"`

**Sample:**

```bash
#!/bin/bash
for i in 1 2 3
do
  echo "Welcome $i times"
done
```

🔧 Used to automate **backups, deployments, updates**, etc.

---
Here’s a **detailed and interview-ready explanation** for **Networking & Security** in **DevOps**, using simple language and clear formatting — perfect for revision and confidence building:

---