# Production Node.js applications with PM2

PM2 is a popular process manager for Node.js applications. It helps in managing and keeping applications online, automatically restarting them if they crash, and simplifying common administrative tasks. Here's a cheat sheet covering what PM2 does and its most useful commands:

## **What PM2 Does:**

- **Starts/Stops/Restarts Node.js applications.**
- **Keeps applications running indefinitely.** Auto-restarts apps if they crash.
- **Load Balancing:** Can run multiple instances of applications to enhance performance.
- **Monitoring:** Offers basic monitoring features for your applications (CPU, memory usage).
- **Log Management:** Keeps track of application logs.
- **Cluster Mode:** Enables running applications in cluster mode without changing code.
- **Startup Scripts:** Automatically restarts applications when the server reboots.

## **Basic PM2 Commands:**

1. **Starting an Application:**

   ```bash
   pm2 start app.js
   pm2 start app.js --name "myApp"  # Start with a custom name
   ```

2. **Listing Running Processes:**

   ```bash
   pm2 list
   ```

3. **Monitoring Application Logs, CPU, and Memory:**

   ```bash
   pm2 monit
   ```

4. **Stopping an Application:**

   ```bash
   pm2 stop app_name_or_id
   ```

5. **Restarting an Application:**

   ```bash
   pm2 restart app_name_or_id
   ```

6. **Deleting an Application from PM2's List:**

   ```bash
   pm2 delete app_name_or_id
   ```

7. **Displaying Logs:**

   ```bash
   pm2 logs
   pm2 logs app_name_or_id  # View logs for a specific app
   ```

8. **Reloading an Application:**
   - Gracefully restarts all processes of the specified application:
     ```bash
     pm2 reload app_name_or_id
     ```
9. **Scaling Applications (Cluster Mode):**

   ```bash
   pm2 scale app_name number_of_instances
   ```

10. **Startup Script Generation:**
    - Generates a startup script to respawn PM2 and its processes on boot:
      ```bash
      pm2 startup
      ```
    - After running **`pm2 startup`**, you'll get a command to execute with superuser privileges.
11. **Saving the Current Process List:**

    ```bash
    pm2 save
    ```

12. **Resurrecting Previously Saved Processes:**

    ```bash
    pm2 resurrect
    ```

13. **Updating PM2:**

    ```bash
    pm2 update
    ```

## **Additional Notes:**

<br/>

- **PM2 Configuration File:** You can also manage applications using an ecosystem configuration file (**`ecosystem.config.js`**), which allows for more complex setups.
- **Cluster Mode:** Useful for taking full advantage of multi-core systems, but it's important to note that not all applications are suitable for running in cluster mode.
- **Environment Variables:** PM2 allows you to inject environment variables directly from the command line or via an ecosystem file.
- **Log Rotation:** PM2 has a module to manage log rotation, which can be vital for applications with extensive logging.
