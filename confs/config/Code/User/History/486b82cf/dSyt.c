#include <stddef.h>
#include <unistd.h>
#include <fcntl.h>

void my_puts(const char *str)
{
    size_t len = 0;
    while(str[len] != 0)
        len++;
    
    ssize_t w = write(STDOUT_FILENO,str,len);
}

// REMMOOOOVE

int main()
{
    my_puts("Glm le bosse");
    return 0;
}
