#include "worker.h"

#include <err.h>
#include <signal.h>
#include <stdlib.h>
#include <sys/wait.h>
#include <unistd.h>

#include "utils.h"
#include "worker_job.h"

/* Sends a SIGINT signal (check kill(2)) to all non-exited workers */
static void kill_remaining_workers(struct proc_pool *pool, size_t nb_launched)
{
    size_t count = 0;
    for (int i = 0; i < nb_launched; i++)
    {
        if (pool->workers[i] != 0)
        {
            kill(pool->workers[i],SIGINT);
        }
    }
}

void launch_workers(struct proc_pool *pool, char *lock_path,
                    char *wordlist_path, size_t psw_per_worker)
{
    // TODO
    int f = fopen(wordlist_path,r);
      

    // 1) Open the wordlist (read-only mode) => check fopen(3)

    // 2) Launch all the workers - for each worker:
    /* 2.1) Save the wordlist file byte offset (from the start of the file)
     * the worker has to start from in order to send passwords */

    /* 2.2) Get the number of passwords the worker has to send
     * and update the byte offset => check next_nb_psw_to_send(...) */

    // 2.3) Set the worker job options => check struct worker_job_options

    /* 2.4) Fork
     *  If it fails, perform a clean shutdown:
     *      - print error message
     *      - kill remaining workers
     *      - wait for them
     *      - call abort(2)
     *  On success, in the CHILD process:
     *      - close file 'wordlist" => check fclose(3)
     *      - start worker job:
     *          *if the password is found exit with code 0
     *          *otherwise, exit with code 1
     *  On success, in the PARENT process:
     *      - log message on stdout showing the worker_id and its PID
     */
}

void wait_workers(struct proc_pool *pool, size_t nb_launched)
{
    /* While there are pending processes, wait for any child process to exit.
     * When a process exits, get its PID and determine to which worker_id it is
     * linked, then set its PID value in 'workers' to 0
     * -> that is workers[worker_id] = 0 (+ log message on stdout).
     * If the process exited normally with code 0, kill all remaining processes
     * and continue waiting. */
}
