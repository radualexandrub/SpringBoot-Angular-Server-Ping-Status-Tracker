# Running locally without Docker in CentOS 8

Table of Contents (ToC):

- [Running locally without Docker in CentOS 8](#running-locally-without-docker-in-centos-8)
  - [Enabling root login over SSH](#enabling-root-login-over-ssh)
  - [Various Commands in CentOS 8](#various-commands-in-centos-8)
  - [Downloading git and cloning serverpingstatustracker app](#downloading-git-and-cloning-serverpingstatustracker-app)
  - [Setting up MySQL Java Maven Node Nginx environment in CentOS8](#setting-up-mysql-java-maven-node-nginx-environment-in-centos8)
    - [Install MySQL 8.0.26](#install-mysql-8026)
    - [Install and Configure Java 17](#install-and-configure-java-17)
    - [Install Maven 3.9.6](#install-maven-396)
    - [Install Node 20.9 and npm 10.1](#install-node-209-and-npm-101)
    - [Install Angular 17.3](#install-angular-173)
    - [Install Nginx 1.14](#install-nginx-114)
  - [Running the application](#running-the-application)
    - [Exposing the ports](#exposing-the-ports)
    - [Start MySQL Server and SpringBoot backend](#start-mysql-server-and-springboot-backend)
    - [Start Angular frontend with Nginx](#start-angular-frontend-with-nginx)
      - [Configure environtment.prod.ts](#configure-environtmentprodts)
      - [Configure CLIENT_ALLOWED_CORS_ORIGINS Env Variable](#configure-client_allowed_cors_origins-env-variable)
      - [Build frontend Angular app](#build-frontend-angular-app)
      - [Start Nginx Server](#start-nginx-server)
    - [Open the app from another PC](#open-the-app-from-another-pc)

<br/>
<hr/>

We can download an install CentOS Stream 8 x86_64 from https://www.centos.org/download/ (Installation type will be as a Server with no GUI).

We can use Windows "Hyper-V Manager" builtin application in order to deploy this OS as a VM (Virtual Machine).

<br/>

After installation, we can run `cat /etc/centos-release` to check the version:

```bash
cat /etc/centos-release
# CentOS Stream release 8
```

<br/>

## Enabling root login over SSH

https://serverastra.com/docs/Tutorials/Set-Up-and-Secure-SSH-on-CentOS%2C-Rocky%2C-and-AlmaLinux-7%2C-8%2C-and-9

Before you start, make sure your system is up to date. Open a terminal window and run the following commands:

```bash
sudo yum update
```

SSH is installed and enabled by default on most CentOS, Rocky, and AlmaLinux distributions. You can check the status of the SSH service (and enable it) with the following command:

```bash
sudo systemctl status sshd

sudo systemctl enable sshd
sudo systemctl start sshd
```

<br/>

Edit the following file

```bash
vi /etc/ssh/sshd_config
```

Uncommnent the line `PermitRootLogin yes` and save the updated file (ESC + `:wq!`)

> Note that this line might be already uncommented and set to yes in CentOS 8.

Restart SSH serverr

```bash
service sshd restart
```

<br/>

Now, from another Terminal (e.g. on Windows machine), we should be able to login `ssh root@<RHEL_VM_IpAddress>`. Note that you can find the VM's IpAddress by running `ip addr show eth0`

<br/>

## Various Commands in CentOS 8

**Set date, time, timezone:**

https://www.tecmint.com/set-time-timezone-and-synchronize-time-using-timedatectl-command/

```bash
timedatectl status
# Local time: Sat 2024-04-06 05:58:26 EDT
# Universal time: Sat 2024-04-06 09:58:26 UTC
# RTC time: Sat 2024-04-06 09:58:26
# Time zone: America/New_York (EDT, -0400)
# System clock synchronized: yes
# NTP service: active
# RTC in local TZ: no
```

To view all available timezones, run `timedatectl list-timezones | cat`

```bash
timedatectl list-timezones | grep Bucharest
# Europe/Bucharest

timedatectl set-timezone "Europe/Bucharest"

date
# Sat Apr  6 13:01:17 EEST 2024
```

```bash
# E.g. Other timedatectl commands:

# Setting time in HH:MM:SS
timedatectl set-time 13:04:30

# Setting date and time
timedatectl set-time '2024-04-06 13:04:50'
```

<br/>
<hr/>

**Setting history command to display date and time**

https://linuxhandbook.com/history-command-timestamp/

To **temporarily** enable timestamps in the history command, you have to export the `HISTTIMEFORMAT` environment variable.

```bash
export HISTTIMEFORMAT="%F %T "

# %F will show the date in YYYY-MM-DD format.
# %T will show time in HH:MM:SS format.
```

However, as the modifications are only effective during the current session, the history command will return to its previous appearance after a reboot.

<br/>

To **permanently** enable timestamps in the history command:

```bash
nano ~/.bashrc

# At the end of the file add the following line:
export HISTTIMEFORMAT="%F %T "
```

Save the changes `CTRL+O` and exit nano `CTRL+X`.

Now, to take those changes into effect, you will have to source the `.bashrc` file using the `source` command:

```bash
source ~/.bashrc
```

<br/>
<hr/>

**Check allocated storage by running:**

```bash
df -h /
# Filesystem           Size  Used Avail Use% Mounted on
# /dev/mapper/cs-root   14G  3.6G  9.9G  27% /

df -H /
# Filesystem           Size  Used Avail Use% Mounted on
# /dev/mapper/cs-root   15G  3.9G   11G  27% /

df -h
# Filesystem           Size  Used Avail Use% Mounted on
# devtmpfs             334M     0  334M   0% /dev
# tmpfs                354M     0  354M   0% /dev/shm
# tmpfs                354M  5.0M  349M   2% /run
# tmpfs                354M     0  354M   0% /sys/fs/cgroup
# /dev/mapper/cs-root   14G  3.6G  9.9G  27% /
# /dev/sda1           1014M  274M  741M  27% /boot
# tmpfs                 71M     0   71M   0% /run/user/0

# man df
# -h, --human-readable
#       print sizes in powers of 1024 (e.g., 1023M)

# -H, --si
#       print sizes in powers of 1000 (e.g., 1.1G)
```

```bash
du -sh /*
# 0       /bin
# 235M    /boot
# 0       /dev
# 27M     /etc
# 0       /home
# 0       /lib
# 0       /lib64
# 0       /media
# 0       /mnt
# 0       /opt
# 0       /proc
# 28K     /root
# 4.9M    /run
# 0       /sbin
# 0       /srv
# 0       /sys
# 16K     /tmp
# 2.3G    /usr
# 307M    /var

du -sh /var/* | sort
# 0       /var/account
# 0       /var/adm
# 0       /var/crash
# 0       /var/db
# 0       /var/empty
# 0       /var/ftp
# 0       /var/games
# 0       /var/gopher
# 0       /var/kerberos
# 0       /var/local
# 0       /var/lock
# 0       /var/mail
# 0       /var/nis
# 0       /var/opt
# 0       /var/preserve
# 0       /var/run
# 0       /var/spool
# 0       /var/tmp
# 0       /var/yp
# 223M    /var/lib
# 5.7M    /var/log
# 79M     /var/cache
```

> Note: `df` provides an overview of disk space usage at the entire file system level, while `du` helps estimate disk usage at the directory or file level.

<br/>

Check available RAM memory:

```bash
free -h
#               total        used        free      shared  buff/cache   available
# Mem:          303Mi       134Mi        79Mi       2.0Mi        90Mi        71Mi
# Swap:         1.6Gi        81Mi       1.5Gi
```

<br/>
<hr/>

<br/>

## Downloading git and cloning serverpingstatustracker app

(Saturyday, April 06, 2024, 13:23)

We can download and install `git` via [YUM Package Manager](https://www.redhat.com/sysadmin/how-manage-packages) directly from the RHEL repository by running:

```bash
yum install git
```

```bash
git -v
# git version 2.43.0

rpm -qa | grep "git-"
# git-core-doc-2.43.0-1.el8.noarch
# git-core-2.43.0-1.el8.x86_64
# git-2.43.0-1.el8.x86_64
```

<br/>

Now we can download the application that we want to run (without Docker)

Example: https://github.com/radualexandrub/SpringBoot-Angular-Server-Ping-Status-Tracker

```bash
cd /opt
git clone https://github.com/radualexandrub/SpringBoot-Angular-Server-Ping-Status-Tracker serverpingstatustracker
cd serverpingstatustracker

ls -lah
# total 128K
# drwxr-xr-x. 7 root root 4.0K Apr  6 13:24 .
# drwxr-xr-x. 3 root root   37 Apr  6 13:24 ..
# drwxr-xr-x. 3 root root 4.0K Apr  6 13:24 app_demos
# -rw-r--r--. 1 root root 2.0K Apr  6 13:24 docker-compose.yml
# -rw-r--r--. 1 root root   28 Apr  6 13:24 .dockerignore
# -rw-r--r--. 1 root root  178 Apr  6 13:24 .env
# drwxr-xr-x. 8 root root  163 Apr  6 13:24 .git
# -rw-r--r--. 1 root root  395 Apr  6 13:24 .gitignore
# -rw-r--r--. 1 root root 1.1K Apr  6 13:24 LICENSE
# drwxr-xr-x. 3 root root   21 Apr  6 13:24 .mvn
# -rw-r--r--. 1 root root  11K Apr  6 13:24 mvnw
# -rw-r--r--. 1 root root 6.6K Apr  6 13:24 mvnw.cmd
# -rw-r--r--. 1 root root 2.9K Apr  6 13:24 pom.xml
# -rw-r--r--. 1 root root  37K Apr  6 13:24 README_Docker_RedHat.md
# -rw-r--r--. 1 root root  26K Apr  6 13:24 README.md
# drwxr-xr-x. 3 root root 4.0K Apr  6 13:24 serverpingstatustracker-app
# -rw-r--r--. 1 root root 1.1K Apr  6 13:24 Spring.Dockerfile
# drwxr-xr-x. 4 root root   30 Apr  6 13:24 src

pwd
# /opt/serverpingstatustracker
```

<br/>

## Setting up MySQL Java Maven Node Nginx environment in CentOS8

### Install MySQL 8.0.26

Install MySQL:

https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-8

```bash
sudo dnf install mysql-server

# Dependencies resolved.
# =========================================================================================================
#  Package                       Architecture  Version                                  Repository    Size
# =========================================================================================================
# Installing:
#  mysql-server                  x86_64        8.0.26-1.module_el8.4.0+915+de215114     appstream     25 M
# Installing dependencies:
#  mariadb-connector-c-config    noarch        3.1.11-2.el8_3                           appstream     15 k
#  mecab                         x86_64        0.996-1.module_el8.4.0+589+11e12751.9    appstream    393 k
#  mysql                         x86_64        8.0.26-1.module_el8.4.0+915+de215114     appstream     12 M
#  mysql-common                  x86_64        8.0.26-1.module_el8.4.0+915+de215114     appstream    134 k
#  mysql-errmsg                  x86_64        8.0.26-1.module_el8.4.0+915+de215114     appstream    598 k
#  protobuf-lite                 x86_64        3.5.0-15.el8                             appstream    149 k
# Enabling module streams:
#  mysql                                       8.0

# Transaction Summary
# =========================================================================================================
# Install  7 Packages

# Total download size: 38 M
# Installed size: 195 M

date
# Sat Apr  6 18:44:17 EEST 2024
```

<br/>

Start the MySQL service and check status:

```bash
sudo systemctl start mysqld.service

sudo systemctl status mysqld
# ● mysqld.service - MySQL 8.0 database server
#    Loaded: loaded (/usr/lib/systemd/system/mysqld.service; disabled; vendor preset: disabled)
#    Active: active (running) since Sat 2024-04-06 18:47:52 EEST; 10s ago
#   Process: 41940 ExecStartPost=/usr/libexec/mysql-check-upgrade (code=exited, status=0/SUCCESS)
#   Process: 41707 ExecStartPre=/usr/libexec/mysql-prepare-db-dir mysqld.service (code=exited, status=0/SUCCESS)
#   Process: 41683 ExecStartPre=/usr/libexec/mysql-check-socket (code=exited, status=0/SUCCESS)
#  Main PID: 41794 (mysqld)
#    Status: "Server is operational"
#     Tasks: 38 (limit: 4268)
#    Memory: 437.2M
#    CGroup: /system.slice/mysqld.service
#            └─41794 /usr/libexec/mysqld --basedir=/usr

# Apr 06 18:47:45 radu_centos8 systemd[1]: Starting MySQL 8.0 database server...
# Apr 06 18:47:45 radu_centos8 mysql-prepare-db-dir[41707]: Initializing MySQL database
# Apr 06 18:47:52 radu_centos8 systemd[1]: Started MySQL 8.0 database server.
```

<br/>

Set up the root (or user) password for MySQL:

```bash
sudo mysql_secure_installation

# Securing the MySQL server deployment.
# Enter password for user root:

# Error: Can't connect to local MySQL server through socket '/var/lib/mysql/mysql.sock' (2)
# Note: for this error, the MySQL server needs to be running first
```

```bash
sudo mysql_secure_installation

# Securing the MySQL server deployment.

# Connecting to MySQL using a blank password.

# VALIDATE PASSWORD COMPONENT can be used to test passwords
# and improve security. It checks the strength of password
# and allows the users to set only those passwords which are
# secure enough. Would you like to setup VALIDATE PASSWORD component?

# Press y|Y for Yes, any other key for No: y

# There are three levels of password validation policy:

# LOW    Length >= 8
# MEDIUM Length >= 8, numeric, mixed case, and special characters
# STRONG Length >= 8, numeric, mixed case, special characters and dictionary  file

# Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG: 0
# Please set the password for root here.

# New password:
# Re-enter new password:

# Estimated strength of the password: 50
# Do you wish to continue with the password provided?(Press y|Y for Yes, any other key for No) : y
# By default, a MySQL installation has an anonymous user,
# allowing anyone to log into MySQL without having to have
# a user account created for them. This is intended only for
# testing, and to make the installation go a bit smoother.
# You should remove them before moving into a production
# environment.


# Remove anonymous users? (Press y|Y for Yes, any other key for No) : No
#  ... skipping.


# Normally, root should only be allowed to connect from
# 'localhost'. This ensures that someone cannot guess at
# the root password from the network.


# Disallow root login remotely? (Press y|Y for Yes, any other key for No) : No
#  ... skipping.


# By default, MySQL comes with a database named 'test' that
# anyone can access. This is also intended only for testing,
# and should be removed before moving into a production
# environment.

# Remove test database and access to it? (Press y|Y for Yes, any other key for No) : y
#  - Dropping test database...
# Success.

#  - Removing privileges on test database...
# Success.


# Reloading the privilege tables will ensure that all changes
# made so far will take effect immediately.

# Reload privilege tables now? (Press y|Y for Yes, any other key for No) : y
# Success.

# All done!
```

<br/>

Testing MySQL

```bash
mysqladmin -u root -p version
# Enter password:
# mysqladmin  Ver 8.0.26 for Linux on x86_64 (Source distribution)
# Copyright (c) 2000, 2021, Oracle and/or its affiliates.

# Oracle is a registered trademark of Oracle Corporation and/or its
# affiliates. Other names may be trademarks of their respective
# owners.

# Server version          8.0.26
# Protocol version        10
# Connection              Localhost via UNIX socket
# UNIX socket             /var/lib/mysql/mysql.sock
# Uptime:                 8 min 1 sec

# Threads: 2  Questions: 12  Slow queries: 0  Opens: 133  Flush tables: 3  Open tables: 49  Queries per second avg: 0.024
```

<br/>

Create the `pingstatustracker` **database**:

Connect to MySQL by running:

```bash
mysql -u root -p
```

Then run:

```sql
show databases;

create database pingstatustracker;
-- Query OK, 1 row affected (0.01 sec)

show databases;
-- +--------------------+
-- | Database           |
-- +--------------------+
-- | information_schema |
-- | mysql              |
-- | performance_schema |
-- | pingstatustracker  |
-- | sys                |
-- +--------------------+
-- 5 rows in set (0.00 sec)

use pingstatustracker; -- it should be empty if SpringBoot App was never ran
show tables;
select * from server; -- it should return error SpringBoot App was never ran

exit
-- Bye
```

<br/>

### Install and Configure Java 17

https://www.digitalocean.com/community/tutorials/how-to-install-java-on-centos-and-fedora

```bash
sudo yum install java-17-openjdk

# Last metadata expiration check: 0:02:05 ago on Sat 06 Apr 2024 07:00:38 PM EEST.
# Dependencies resolved.
# =======================================================================================
#  Package                    Architecture   Version                  Repository    Size
# =======================================================================================
# Installing:
#  java-17-openjdk            x86_64         1:17.0.6.0.9-0.3.ea.el8  appstream    451 k
# Installing dependencies:
#  adwaita-cursor-theme       noarch         3.28.0-3.el8             appstream    647 k
#  adwaita-icon-theme         noarch         3.28.0-3.el8             appstream     11 M
#  alsa-lib                   x86_64         1.2.10-2.el8             appstream    519 k
#  at-spi2-atk                x86_64         2.26.2-1.el8             appstream     89 k
#  at-spi2-core               x86_64         2.28.0-1.el8             appstream    169 k
#  atk                        x86_64         2.28.1-1.el8             appstream    272 k
#  colord-libs                x86_64         1.4.2-1.el8              appstream    236 k
#  copy-jdk-configs           noarch         4.0-2.el8                appstream     31 k
#  cups-libs                  x86_64         1:2.2.6-57.el8           baseos       436 k
#  fribidi                    x86_64         1.0.4-9.el8              appstream     89 k
#  gdk-pixbuf2-modules        x86_64         2.36.12-5.el8            appstream    109 k
#  graphite2                  x86_64         1.3.10-10.el8            appstream    122 k
#  gtk-update-icon-cache      x86_64         3.22.30-11.el8           appstream     32 k
#  harfbuzz                   x86_64         1.7.5-4.el8              appstream    296 k
#  hicolor-icon-theme         noarch         0.17-2.el8               appstream     49 k
#  jasper-libs                x86_64         2.0.14-5.el8             appstream    167 k
#  java-17-openjdk-headless   x86_64         1:17.0.6.0.9-0.3.ea.el8  appstream     43 M
#  javapackages-filesystem    noarch         5.3.0-1.module_el8.0.0+1 appstream     30 k
#  jbigkit-libs               x86_64         2.1-14.el8               appstream     55 k
#  lcms2                      x86_64         2.9-2.el8                appstream    165 k
#  libXcomposite              x86_64         0.4.4-14.el8             appstream     28 k
#  libXcursor                 x86_64         1.1.15-3.el8             appstream     36 k
#  libXdamage                 x86_64         1.1.4-14.el8             appstream     27 k
#  libXfixes                  x86_64         5.0.3-7.el8              appstream     25 k
#  libXft                     x86_64         2.3.3-1.el8              appstream     67 k
#  libXi                      x86_64         1.7.10-1.el8             appstream     49 k
#  libXinerama                x86_64         1.1.4-1.el8              appstream     16 k
#  libXrandr                  x86_64         1.5.2-1.el8              appstream     34 k
#  libXtst                    x86_64         1.2.3-7.el8              appstream     22 k
#  libdatrie                  x86_64         0.2.9-7.el8              appstream     33 k
#  libepoxy                   x86_64         1.5.8-1.el8              appstream    225 k
#  libfontenc                 x86_64         1.1.3-8.el8              appstream     37 k
#  libjpeg-turbo              x86_64         1.5.3-12.el8             appstream    157 k
#  libthai                    x86_64         0.1.27-2.el8             appstream    203 k
#  libtiff                    x86_64         4.0.9-31.el8             appstream    190 k
#  libwayland-client          x86_64         1.21.0-1.el8             appstream     41 k
#  libwayland-cursor          x86_64         1.21.0-1.el8             appstream     26 k
#  libwayland-egl             x86_64         1.21.0-1.el8             appstream     20 k
#  lksctp-tools               x86_64         1.0.18-3.el8             baseos       100 k
#  lua                        x86_64         5.3.4-12.el8             appstream    192 k
#  pango                      x86_64         1.42.4-8.el8             appstream    297 k
#  rest                       x86_64         0.8.1-2.el8              appstream     70 k
#  ttmkfdir                   x86_64         3.0.9-54.el8             appstream     62 k
#  tzdata-java                noarch         2024a-1.el8              appstream    268 k
#  xorg-x11-font-utils        x86_64         1:7.5-41.el8             appstream    104 k
#  xorg-x11-fonts-Type1       noarch         7.5-19.el8               appstream    522 k
# Installing weak dependencies:
#  dconf                      x86_64         0.28.0-4.el8             appstream    108 k
#  gtk3                       x86_64         3.22.30-11.el8           appstream    4.5 M
# Enabling module streams:
#  javapackages-runtime                                        201801

# Transaction Summary
# =======================================================================================
# Install  49 Packages

# Total download size: 66 M
# Installed size: 254 M
```

<br/>

Check installed Java version:

```bash
java -version
# openjdk version "17.0.6-ea" 2023-01-17 LTS
# OpenJDK Runtime Environment (Red_Hat-17.0.6.0.9-0.3.ea.el8) (build 17.0.6-ea+9-LTS)
# OpenJDK 64-Bit Server VM (Red_Hat-17.0.6.0.9-0.3.ea.el8) (build 17.0.6-ea+9-LTS, mixed mode, sharing)
```

Note: If multiple Java versions are installed, you can change/swap it to a defaut version:

<!-- If you installed multiple versions of Java, you may want to set one as your default (i.e. the one that will run when a user runs the `java` command). Additionally, some applications require certain environment variables to be set to locate which installation of Java to use.

The `alternatives` command, which manages default commands through symbolic links, can be used to select the default Java version. To list the available versions of Java that can be managed by `alternatives`, use `alternatives --config java`: -->

```bash
sudo alternatives --config java
```

<br/>

Configure `$JAVA_HOME` environment variable

> Many Java applications also use the `JAVA_HOME` or `JRE_HOME` environment variables to determine which `java` executable to use.
>
> For example, if you installed Java to `/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.322.b06-2.el8_5.x86_64/jre/bin` i.e. your `java` executable is located at `<^>(/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.322.b06-2.el8_5.x86_64/jre/bin/java`), you could set your `JAVA_HOME` environment variable in a bash shell or script like so:
>
> ```bash
> export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.322.b06-2.el8_5.x86_64/jre
> ```
>
> If you want `JAVA_HOME` to be set for every user on the system by default, add the previous line to the `/etc/environment` file. You can append it to the file using `echo` and `>>` shell redirection, in order to avoid having to edit the `/etc/environment` file directly, by running this command:
>
> ```bash
> sudo sh -c "echo export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.322.b06-2.el8_5.x86_64/j
> ```

- For our Java 17, we can run:

```bash
vi /etc/environment

# Add at end of file
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-17.0.6.0.9-0.3.ea.el8.x86_64

# Save and Exit vim :wq
# Check JAVA_HOME is set
cat /etc/environment


# or for short
sudo sh -c "echo export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-17.0.6.0.9-0.3.ea.el8.x86_64 >> /etc/environment"
cat /etc/environment
```

<br/>

### Install Maven 3.9.6

https://maven.apache.org/docs/history.html

Based on above table, we can first search which maven version we need for Java 17, and also check if it's available in default yum repository of CentOS 8.

https://access.redhat.com/sites/default/files/attachments/rh_yum_cheatsheet_1214_jcs_print-1.pdf

```bash
yum search maven
# Last metadata expiration check: 0:25:04 ago on Sat 06 Apr 2024 07:00:38 PM EEST.
# =================================================== Name Exactly Matched: maven ====================================================
# maven.noarch : Java project management and project comprehension tool
# ================================================== Name & Summary Matched: maven ===================================================
# directory-maven-plugin-javadoc.noarch : Javadoc for directory-maven-plugin
# maven-lib.noarch : Core part of Maven
# maven-resolver-api.noarch : Maven Artifact Resolver API
# maven-resolver-connector-basic.noarch : Maven Artifact Resolver Connector Basic
# maven-resolver-impl.noarch : Maven Artifact Resolver Implementation
# maven-resolver-spi.noarch : Maven Artifact Resolver SPI
# maven-resolver-transport-wagon.noarch : Maven Artifact Resolver Transport Wagon
# maven-resolver-util.noarch : Maven Artifact Resolver Utilities
# maven-shared-utils.noarch : Maven shared utility classes
# maven-wagon-file.noarch : file module for maven-wagon
# maven-wagon-http.noarch : http module for maven-wagon
# maven-wagon-http-shared.noarch : http-shared module for maven-wagon
# maven-wagon-provider-api.noarch : provider-api module for maven-wagon
# ======================================================= Name Matched: maven ========================================================
# directory-maven-plugin.noarch : Establish locations for files in multi-module builds
```

```bash
sudo yum install maven
# Last metadata expiration check: 0:43:20 ago on Sat 06 Apr 2024 07:00:38 PM EEST.
# Dependencies resolved.
# ====================================================================================================================================
#  Package                                      Arch        Version                                              Repository      Size
# ====================================================================================================================================
# Installing:
#  maven                                        noarch      1:3.5.4-5.module_el8.6.0+1030+8d97e896               appstream       27 k
# Installing dependencies:
#  aopalliance                                  noarch      1.0-17.module_el8.6.0+1030+8d97e896                  appstream       17 k
#  apache-commons-cli                           noarch      1.4-4.module_el8.0.0+39+6a9b6e22                     appstream       74 k
#  apache-commons-codec                         noarch      1.11-3.module_el8.0.0+39+6a9b6e22                    appstream      288 k
#  apache-commons-io                            noarch      1:2.6-3.module_el8.6.0+1030+8d97e896                 appstream      224 k
#  apache-commons-lang3                         noarch      3.7-3.module_el8.0.0+39+6a9b6e22                     appstream      483 k
#  apache-commons-logging                       noarch      1.2-13.module_el8.6.0+1030+8d97e896                  appstream       85 k
#  atinject                                     noarch      1-28.20100611svn86.module_el8.6.0+1030+8d97e896      appstream       20 k
#  cdi-api                                      noarch      1.2-8.module_el8.6.0+1030+8d97e896                   appstream       70 k
#  geronimo-annotation                          noarch      1.0-23.module_el8.6.0+1030+8d97e896                  appstream       25 k
#  glassfish-el-api                             noarch      3.0.1-0.14.b08.module+el8.2.1+7436+4afdca1f          appstream      106 k
#  google-guice                                 noarch      4.1-11.module_el8.0.0+39+6a9b6e22                    appstream      471 k
#  guava20                                      noarch      20.0-8.module_el8.0.0+39+6a9b6e22                    appstream      2.1 M
#  hawtjni-runtime                              noarch      1.16-2.module_el8.0.0+39+6a9b6e22                    appstream       43 k
#  httpcomponents-client                        noarch      4.5.5-5.module_el8.6.0+1030+8d97e896                 appstream      718 k
#  httpcomponents-core                          noarch      4.4.10-3.module_el8.0.0+39+6a9b6e22                  appstream      638 k
#  jansi                                        noarch      1.17.1-1.module_el8.6.0+1030+8d97e896                appstream       79 k
#  jansi-native                                 x86_64      1.7-7.module_el8.6.0+1030+8d97e896                   appstream       75 k
#  java-1.8.0-openjdk                           x86_64      1:1.8.0.362.b08-3.el8                                appstream      544 k
#  java-1.8.0-openjdk-devel                     x86_64      1:1.8.0.362.b08-3.el8                                appstream      9.8 M
#  java-1.8.0-openjdk-headless                  x86_64      1:1.8.0.362.b08-3.el8                                appstream       34 M
#  javapackages-tools                           noarch      5.3.0-1.module_el8.0.0+11+5b8c10bd                   appstream       44 k
#  jboss-interceptors-1.2-api                   noarch      1.0.0-8.module_el8.0.0+39+6a9b6e22                   appstream       33 k
#  jcl-over-slf4j                               noarch      1.7.25-4.module_el8.6.0+1030+8d97e896                appstream       32 k
#  jsoup                                        noarch      1.11.3-3.module_el8.6.0+1030+8d97e896                appstream      386 k
#  maven-lib                                    noarch      1:3.5.4-5.module_el8.6.0+1030+8d97e896               appstream      1.4 M
#  maven-resolver-api                           noarch      1:1.1.1-2.module_el8.0.0+39+6a9b6e22                 appstream      138 k
#  maven-resolver-connector-basic               noarch      1:1.1.1-2.module_el8.0.0+39+6a9b6e22                 appstream       51 k
#  maven-resolver-impl                          noarch      1:1.1.1-2.module_el8.0.0+39+6a9b6e22                 appstream      177 k
#  maven-resolver-spi                           noarch      1:1.1.1-2.module_el8.0.0+39+6a9b6e22                 appstream       40 k
#  maven-resolver-transport-wagon               noarch      1:1.1.1-2.module_el8.0.0+39+6a9b6e22                 appstream       39 k
#  maven-resolver-util                          noarch      1:1.1.1-2.module_el8.0.0+39+6a9b6e22                 appstream      148 k
#  maven-shared-utils                           noarch      3.2.1-0.1.module_el8.6.0+1030+8d97e896               appstream      165 k
#  maven-wagon-file                             noarch      3.1.0-1.module_el8.6.0+1030+8d97e896                 appstream       26 k
#  maven-wagon-http                             noarch      3.1.0-1.module_el8.6.0+1030+8d97e896                 appstream       27 k
#  maven-wagon-http-shared                      noarch      3.1.0-1.module_el8.6.0+1030+8d97e896                 appstream       49 k
#  maven-wagon-provider-api                     noarch      3.1.0-1.module_el8.6.0+1030+8d97e896                 appstream       63 k
#  plexus-cipher                                noarch      1.7-14.module_el8.6.0+1030+8d97e896                  appstream       29 k
#  plexus-classworlds                           noarch      2.5.2-9.module_el8.0.0+39+6a9b6e22                   appstream       65 k
#  plexus-containers-component-annotations      noarch      1.7.1-8.module_el8.0.0+39+6a9b6e22                   appstream       24 k
#  plexus-interpolation                         noarch      1.22-9.module_el8.0.0+39+6a9b6e22                    appstream       79 k
#  plexus-sec-dispatcher                        noarch      1.4-26.module_el8.0.0+39+6a9b6e22                    appstream       37 k
#  plexus-utils                                 noarch      3.1.0-3.module_el8.0.0+39+6a9b6e22                   appstream      259 k
#  publicsuffix-list                            noarch      20180723-1.el8                                       baseos          79 k
#  sisu-inject                                  noarch      1:0.3.3-6.module_el8.6.0+1030+8d97e896               appstream      339 k
#  sisu-plexus                                  noarch      1:0.3.3-6.module_el8.6.0+1030+8d97e896               appstream      180 k
#  slf4j                                        noarch      1.7.25-4.module_el8.6.0+1030+8d97e896                appstream       77 k
# Installing weak dependencies:
#  gtk2                                         x86_64      2.24.32-5.el8                                        appstream      3.4 M

# Transaction Summary
# ====================================================================================================================================
# Install  48 Packages

# Total download size: 57 M
# Installed size: 185 M
```

Hmm, it seems we can only install Maven version 3.5.4...

<br/>

We can install Maven from their Apache website:

https://maven.apache.org/install.html

Download `apache-maven-3.9.6-bin.tar.gz` from https://maven.apache.org/download.cgi and move it to `/opt` directory in Linux

Then run

```bash
cd /opt

# Extract distribution archive to "apache-maven-3.9.6" folder
tar xzvf apache-maven-3.9.6-bin.tar.gz

# Delete the archive
rm -f apache-maven-3.9.6-bin.tar.gz
```

Add the `bin` directory of the created directory `apache-maven-3.9.6` to the `PATH` environment variable

```bash
vi ~/.bashrc

# Add to the end
export PATH="/opt/apache-maven-3.9.6/bin:$PATH"

# Apply the changes
source ~/.bashrc
```

<br/>

Now we can check Maven version:

```bash
mvn -v
# Apache Maven 3.9.6 (bc0240f3c744dd6b6ec2920b3cd08dcc295161ae)
# Maven home: /opt/apache-maven-3.9.6
# Java version: 17.0.6-ea, vendor: Red Hat, Inc., runtime: /usr/lib/jvm/java-17-openjdk-17.0.6.0.9-0.3.ea.el8.x86_64
# Default locale: en_US, platform encoding: UTF-8
# OS name: "linux", version: "4.18.0-547.el8.x86_64", arch: "amd64", family: "unix"
```

<br/>
<br/>

At this point, we should be able to run up our backend app:

```bash
cd /opt/serverpingstatustracker
mvn spring-boot:run

# [INFO] Attaching agents: []

#   .   ____          _            __ _ _
#  /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
# ( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
#  \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
#   '  |____| .__|_| |_|_| |_\__, | / / / /
#  =========|_|==============|___/=/_/_/_/
#  :: Spring Boot ::      (v2.7.14-SNAPSHOT)

# 2024-04-06 19:47:35.834  INFO 44088 --- [           main] c.r.s.ServerpingstatustrackerApplication : Starting ServerpingstatustrackerApplication using Java 17.0.6-ea on radu_centos8 with PID 44088 (/opt/serverpingstatustracker/target/classes started by root in /opt/serverpingstatustracker)
# 2024-04-06 19:47:35.837  INFO 44088 --- [           main] c.r.s.ServerpingstatustrackerApplication : No active profile set, falling back to 1 default profile: "default"
# 2024-04-06 19:47:36.376  INFO 44088 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories in DEFAULT mode.
# 2024-04-06 19:47:36.418  INFO 44088 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 36 ms. Found 1 JPA repository interfaces.
# 2024-04-06 19:47:36.846  INFO 44088 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
# 2024-04-06 19:47:36.854  INFO 44088 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
# 2024-04-06 19:47:36.855  INFO 44088 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.78]
# 2024-04-06 19:47:36.925  INFO 44088 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
# 2024-04-06 19:47:36.925  INFO 44088 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 1042 ms
# 2024-04-06 19:47:37.200  INFO 44088 --- [           main] o.hibernate.jpa.internal.util.LogHelper  : HHH000204: Processing PersistenceUnitInfo [name: default]
# 2024-04-06 19:47:37.226  INFO 44088 --- [           main] org.hibernate.Version                    : HHH000412: Hibernate ORM core version 5.6.15.Final
# 2024-04-06 19:47:37.333  INFO 44088 --- [           main] o.hibernate.annotations.common.Version   : HCANN000001: Hibernate Commons Annotations {5.1.2.Final}
# 2024-04-06 19:47:37.401  INFO 44088 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
# 2024-04-06 19:47:37.709  INFO 44088 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
# 2024-04-06 19:47:37.718  INFO 44088 --- [           main] org.hibernate.dialect.Dialect            : HHH000400: Using dialect: org.hibernate.dialect.MySQL5InnoDBDialect
# 2024-04-06 19:47:38.444  INFO 44088 --- [           main] o.h.e.t.j.p.i.JtaPlatformInitiator       : HHH000490: Using JtaPlatform implementation: [org.hibernate.engine.transaction.jta.platform.internal.NoJtaPlatform]
# 2024-04-06 19:47:38.449  INFO 44088 --- [           main] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
# 2024-04-06 19:47:38.746  WARN 44088 --- [           main] JpaBaseConfiguration$JpaWebConfiguration : spring.jpa.open-in-view is enabled by default. Therefore, database queries may be performed during view rendering. Explicitly configure spring.jpa.open-in-view to disable this warning
# 2024-04-06 19:47:38.998  INFO 44088 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
# 2024-04-06 19:47:39.010  INFO 44088 --- [           main] c.r.s.ServerpingstatustrackerApplication : Started ServerpingstatustrackerApplication in 5.645 seconds (JVM running for 6.042)
```

Note:

- We can stop the maven process by running `ps aux | grep pingstatustracker` and then `kill -9 <ProcessId>`.
- Then we can check if our application still listens on port 8080 by running `sudo netstat -tulpn | grep "8080.*LISTEN"` (https://www.cyberciti.biz/faq/unix-linux-check-if-port-is-in-use-command/)

<br/>

### Install Node 20.9 and npm 10.1

(Sunday, April 07, 2024, 09:52)

https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-centos-8

Node.js is available from CentOS 8's default AppStream software repository. There are multiple versions available, and you can choose between them by enabling the appropriate *module stream*. First list out the available streams for the `nodejs` module using the `dnf` command:

```bash
sudo dnf module list nodejs

# Last metadata expiration check: 14:44:10 ago on Sat 06 Apr 2024 07:00:38 PM EEST.
# CentOS Stream 8 - AppStream
# Name    Stream  Profiles                                Summary
# nodejs  10 [d]  common [d], development, minimal, s2i   Javascript runtime
# nodejs  12      common [d], development, minimal, s2i   Javascript runtime
# nodejs  14      common [d], development, minimal, s2i   Javascript runtime
# nodejs  16      common [d], development, minimal, s2i   Javascript runtime
# nodejs  18      common [d], development, minimal, s2i   Javascript runtime
# nodejs  20      common [d], development, minimal, s2i   Javascript runtime
```

```bash
sudo dnf module enable nodejs:20
```

```bash
sudo dnf install nodejs

# Last metadata expiration check: 14:46:13 ago on Sat 06 Apr 2024 07:00:38 PM EEST.
# Dependencies resolved.
# ================================================================================================================
#  Package                        Architecture   Version                                        Repository   Size
# ================================================================================================================
# Installing:
#  nodejs                         x86_64         1:20.9.0-1.module_el8+744+0c973fe4             appstream    14 M
# Installing weak dependencies:
#  nodejs-docs                    noarch         1:20.9.0-1.module_el8+744+0c973fe4             appstream    11 M
#  nodejs-full-i18n               x86_64         1:20.9.0-1.module_el8+744+0c973fe4             appstream   8.2 M
#  npm                            x86_64         1:10.1.0-1.20.9.0.1.module_el8+744+0c973fe4    appstream   2.9 M

# Transaction Summary
# ================================================================================================================
# Install  4 Packages

# Total download size: 36 M
# Installed size: 176 M
```

Check versions of Node.js and npm

```bash
node -v
# v20.9.0

npm -v
# 10.1.0
```

<br/>

<br/>

### Install Angular 17.3

Install Angular globally using npm:

```bash
sudo npm install -g @angular/cli
```

```bash
ng version

#      _                      _                 ____ _     ___
#     / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
#    / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
#   / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
#  /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
#                 |___/


# Angular CLI: 17.3.3
# Node: 20.9.0
# Package Manager: npm 10.1.0
# OS: linux x64

# Angular:
# ...

# Package                      Version
# ------------------------------------------------------
# @angular-devkit/architect    0.1703.3 (cli-only)
# @angular-devkit/core         17.3.3 (cli-only)
# @angular-devkit/schematics   17.3.3 (cli-only)
# @schematics/angular          17.3.3 (cli-only)
```

<br/>

Finally, we can run `npm install` in our project app directory:

```bash
cd /opt/serverpingstatustracker/serverpingstatustracker-app/
npm install
```

<br/>

### Install Nginx 1.14

However, to run the frontend Angular application, we will need a server like Nginx - as we cannot just run `ng server --open` (Angular's development server, which will not be exposed/accessible outside localhost).

```bash
sudo yum install nginx

# Last metadata expiration check: 15:20:01 ago on Sat 06 Apr 2024 07:00:38 PM EEST.
# Dependencies resolved.
# ========================================================================================================
#  Package                      Architecture  Version                                   Repository   Size
# ========================================================================================================
# Installing:
#  nginx                        x86_64        1:1.14.1-9.module_el8.0.0+1060+3ab382d3   appstream   570 k
# Installing dependencies:
#  gd                           x86_64        2.2.5-7.el8                               appstream   144 k
#  libXpm                       x86_64        3.5.12-11.el8                             appstream    59 k
#  libwebp                      x86_64        1.0.0-9.el8                               appstream   274 k
#  libxslt                      x86_64        1.1.32-6.el8                              baseos      250 k
#  nginx-all-modules            noarch        1:1.14.1-9.module_el8.0.0+1060+3ab382d3   appstream    23 k
#  nginx-filesystem             noarch        1:1.14.1-9.module_el8.0.0+1060+3ab382d3   appstream    24 k
#  nginx-mod-http-image-filter  x86_64        1:1.14.1-9.module_el8.0.0+1060+3ab382d3   appstream    35 k
#  nginx-mod-http-perl          x86_64        1:1.14.1-9.module_el8.0.0+1060+3ab382d3   appstream    46 k
#  nginx-mod-http-xslt-filter   x86_64        1:1.14.1-9.module_el8.0.0+1060+3ab382d3   appstream    33 k
#  nginx-mod-mail               x86_64        1:1.14.1-9.module_el8.0.0+1060+3ab382d3   appstream    64 k
#  nginx-mod-stream             x86_64        1:1.14.1-9.module_el8.0.0+1060+3ab382d3   appstream    85 k
# Enabling module streams:
#  nginx                                      1.14

# Transaction Summary
# ========================================================================================================
# Install  12 Packages

# Total download size: 1.6 M
# Installed size: 4.0 M
# Is this ok [y/N]:
```

```bash
nginx -v
# nginx version: nginx/1.14.1
```

<br/>

> Note that after installing Nginx, the service will be inactive by default:
>
> ```bash
> systemctl status nginx.service
>
> # ● nginx.service - The nginx HTTP and reverse proxy server
> #    Loaded: loaded (/usr/lib/systemd/system/nginx.service; disabled; vendor preset: disabled)
> #    Active: inactive (dead)
> #
> # Apr 07 10:20:49 radu_centos8 systemd[1]: nginx.service: Unit cannot be reloaded because it is inactive.
> ```

<br/>

## Running the application

### Exposing the ports

By default, the serverpingstatustracker app runs on ports 4200 (development), 80 (http) and 8080. These ports needs to be exposed:

```bash
firewall-cmd --zone=public --add-port=80/tcp --permanent
firewall-cmd --zone=public --add-port=4200/tcp --permanent
firewall-cmd --zone=public --add-port=8080/tcp --permanent
firewall-cmd --zone=public --add-port=8081/tcp --permanent

# Reload the firewall for changes to take effect.
firewall-cmd --reload
```

<br/>

### Start MySQL Server and SpringBoot backend

Start the MySQL Server if not active

```bash
sudo systemctl status mysqld

sudo systemctl start mysqld.service
```

<br/>

Compile and run backend SpringBoot app

```bash
cd /opt/serverpingstatustracker

mvn spring-boot:run
```

> To hide the process in the background: We can press `CTRL+Z` to pause the process, then run `bg` to continue to run the process in the background (https://www.scaler.com/topics/how-to-run-process-in-background-linux/).

<br/>

### Start Angular frontend with Nginx

#### Configure environtment.prod.ts

🔴Note: Before building the Angular frontend app, we may need to configure its `environment.prod.ts` file:

```bash
cd /opt/serverpingstatustracker/

find ./ -name environment.prod.ts
# ./serverpingstatustracker-app/src/environments/environment.prod.ts

vi /opt/serverpingstatustracker/serverpingstatustracker-app/src/environments/environment.prod.ts
```

Change from local address from `http://localhost:8080` to VM's IP Address `http://172.27.74.30:8080`

```bash
# environment.prod.ts
export const environment = {
  production: true,
  apiBaseUrl: 'http://172.27.74.30:8080',
};
```

> Note, the app needs to be compilled after every change here:
>
> ```bash
> cd /opt/serverpingstatustracker/serverpingstatustracker-app
> npm run build --prod
> ```

<br/>

#### Configure CLIENT_ALLOWED_CORS_ORIGINS Env Variable

🔴Note: Backend SpringBoot (within `ServerpingstatustrackerApplication.java`) currently takes its allowed client origins from the `CLIENT_ALLOWED_CORS_ORIGINS` environment variable.

> Check commit no. https://github.com/radualexandrub/SpringBoot-Angular-Server-Ping-Status-Tracker/commit/be099d454cbfacc30d36babce8b96489b46f0eb5

<br/>

We need to set this variable to the VM's IP Address:

```bash
export CLIENT_ALLOWED_CORS_ORIGINS="http://172.27.74.30"
```

And then recompile and rerun the backend Spring Boot application:

```bash
cd /opt/serverpingstatustracker
mvn spring-boot:run
```

<br/>

#### Build frontend Angular app

```bash
# Note: if you open another tab in your terminal, don't forget to ssh back into your VM, lol😂
# Also note that this VM IP might be dynamic (changes after every shutdown)
# ssh root@172.27.74.30

cd /opt/serverpingstatustracker/serverpingstatustracker-app

npm run build --prod

# Our application will be compiled into /dist/out folder
# and should be ready to be deployed via Nginx server
ls -lah /opt/serverpingstatustracker/serverpingstatustracker-app/dist/out
# total 448K
# drwxr-xr-x. 2 root root 4.0K Apr  7 10:16 .
# drwxr-xr-x. 3 root root   17 Apr  7 10:16 ..
# -rw-r--r--. 1 root root  14K Apr  7 10:16 3rdpartylicenses.txt
# -rw-r--r--. 1 root root  948 Apr  7 10:16 favicon.ico
# -rw-r--r--. 1 root root 1.7K Apr  7 10:16 index.html
# -rw-r--r--. 1 root root 373K Apr  7 10:16 main.ab495acf480bac8d.js
# -rw-r--r--. 1 root root  34K Apr  7 10:16 polyfills.e1a86d044b6ac09f.js
# -rw-r--r--. 1 root root  932 Apr  7 10:16 runtime.f309793d5b0ca3cb.js
# -rw-r--r--. 1 root root 3.9K Apr  7 10:16 styles.2ed93d9f3e1d8623.css
```

We can also check the `nginx` configuration file that we have in this project (as a template):

```bash
cat /opt/serverpingstatustracker/serverpingstatustracker-app/nginx-custom.conf

server {
  listen 80;
  location / {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
    add_header 'Access-Control-Allow-Headers' 'X-Requested-With,Accept,Content-Type, Origin';
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html =404;
  }
}
```

<br/>

#### Start Nginx Server

To run the frontend Angular app as production via Nginx:

- Start nginx service

```bash
systemctl status nginx.service
systemctl start nginx.service
```

- ❌[NOT WORKING - SKIP THIS STEP] Edit the `/etc/nginx/conf.d/default.conf`

```bash
# By default this directory is empty
cd /etc/nginx/conf.d

# Create the default.conf file
vi default.conf

# Edit default.conf with the following
server {
  listen 80;
  location / {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
    add_header 'Access-Control-Allow-Headers' 'X-Requested-With,Accept,Content-Type, Origin';
    root /opt/serverpingstatustracker/serverpingstatustracker-app/dist/out;
    index index.html index.htm;
    try_files $uri $uri/ /index.html =404;
  }
}
```

- ✅[WORKING] Edit the `/etc/nginx/nginx.conf`

```bash
cd /etc/nginx/

# Backup the default.conf file
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak

# Edit the default.conf file
vi nginx.conf
```

```bash
# Edit default.conf with the following
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    include /etc/nginx/conf.d/*.conf;
    server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  _;
        root         /usr/share/nginx/html;
        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;
        location / {
          add_header 'Access-Control-Allow-Origin' '*';
          add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
          add_header 'Access-Control-Allow-Headers' 'X-Requested-With,Accept,Content-Type, Origin';
          root /opt/serverpingstatustracker/serverpingstatustracker-app/dist/out;
          index index.html index.htm;
          try_files $uri $uri/ /index.html =404;
        }
        error_page 404 /404.html;
            location = /40x.html {
        }
        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
}
```

- Note: The default contents for `/etc/nginx/nginx.conf` is:

```bash
cat nginx.conf.bak

# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  _;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }

# Settings for a TLS enabled server.
#
#    server {
#        listen       443 ssl http2 default_server;
#        listen       [::]:443 ssl http2 default_server;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        ssl_certificate "/etc/pki/nginx/server.crt";
#        ssl_certificate_key "/etc/pki/nginx/private/server.key";
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers PROFILE=SYSTEM;
#        ssl_prefer_server_ciphers on;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        location / {
#        }
#
#        error_page 404 /404.html;
#            location = /40x.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#            location = /50x.html {
#        }
#    }
}
```

- Reload/Restart nginx service

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl restart nginx
```

<br/>

### Open the app from another PC

(Sunday, April 07, 2024, 13:42)

We can now open our application (both frontend and backend) at our VM's public IP address - found by running `ip addr show eth0`:

- Frontend: http://172.27.74.30
- Backend: http://172.27.74.30:8080/api/servers/

<br/>

<br/>

<br/>

<br/>
