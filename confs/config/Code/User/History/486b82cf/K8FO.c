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
            errx(3,"Writing failure.");
        }
    }
}

// REMMOOOOVE

int main()
{
    my_puts("Glm le bosse");
    return 0;
}
