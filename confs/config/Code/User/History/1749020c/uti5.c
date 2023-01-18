#include <stdio.h>
#include <err.h>
#include <stddef.h>
#include <sys/types.h>
#include <fcntl.h>
#include <unistd.h>

int my_cat(char* file,int e);
int my_cat(char* file,int e)
{
    char* end = "";
    if (e)
        end = "$";

    FILE* fp;
    char bruffer[256];
    if ((fp = fopen(file,"r")) == NULL)
    {
        err(3,"error while opening %s",file);
        return 1;
    }
    
    while(fgets(buffer,sizeof(buffer),fp) != NULL)
    {
        puts("%s%s",buffer,end);
    }

    fclose(fp);
    return 0;
}

int main()
{

}

int my_echo(char* str)
{
    //TODO
}