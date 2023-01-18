  #include <err.h>
#include <stdio.h>
#include <stdlib.h>

#include "utils.h"
#include "worker.h"

int main(int argc, char **argv)
{
    if (argc != 4)
        errx(1, "Usage: ./lock_picker ./[LOCK_EXEC] [WORDLISTPATH] [POOLSIZE]");

    char *lock_path = argv[1];
    char *wordlist_path = argv[2];
    long poolsize = atol(argv[3]);

    if (poolsize <= 0)
        errx(1, "Invalid POOLSIZE, must be strictly positive");

    struct proc_pool pool = { .size = (size_t)poolsize, .workers = NULL };

    size_t nb_passwords = get_nb_passwords(wordlist_path);
    size_t psw_per_worker;

    if (pool.size < nb_passwords)
    {
        psw_per_worker = nb_passwords / pool.size;
    }
    else
    {
        pool.size = nb_passwords;
        psw_per_worker = 1;
    }

    pool.workers = calloc(pool.size, sizeof(pid_t));

    printf("*--*-- Launching Lock Picker --*--*\n");

    launch_workers(&pool, lock_path, wordlist_path, psw_per_worker);

    wait_workers(&pool, pool.size);

    free(pool.workers);

    printf("*--*-- Lock Picker Stop --*--*\n");

    return 0;
}
