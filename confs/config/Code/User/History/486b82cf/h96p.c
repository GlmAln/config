#include <stddef.h>
#include <unistd.h>
#include <fcntl.h>

void my_puts(const char *str)
{
    ssize_t w;
    while ((w = write(STDOUT_FILENO,str,sizeof(char))) != 0)
    {
        if (w == -1)
        {
            errz(3,"Writing failure.")
        }
    }
}
