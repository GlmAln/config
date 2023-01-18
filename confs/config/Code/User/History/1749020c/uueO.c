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
    char buffer[256];
    if ((fp = fopen(file,"r")) == NULL)
    {
        err(3,"error while opening %s",file);
        return 0;
    }
    
    while(fgets(buffer,sizeof(buffer),fp) != NULL)
    {
        printf("%s%s",buffer,end);
    }

    fclose(fp);
    return 1;
}


int my_echo(char* str)
{
    //TODO
}

int main(int argc, char** argv)
{
    if (argv[1] == "cat")
    {
        if (argc < 3)
            errx(1,"error: not enough arguments");
        if (argv[2] == "-e")
        {
            if (argc == 4)
            {
                if (my_cat(argv[3],1) == 0)
                    errx(1,"error");
            }
            else
            {
                errx(1,"error");
            }
        }
        else
        {
            if (argc == 3)
            {
                if (my_cat(argv[2],0) == 0)
                    errx(1,"err");
            }
            else
            {
                errx(1,"error");
            }
        }
    }
    return 0;
}
