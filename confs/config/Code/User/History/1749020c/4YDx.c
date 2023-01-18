#include <stdio.h>
#include <err.h>
#include <stddef.h>
#include <sys/types.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>

int my_cat(char* file,int e)
{
    char end = '0';
    if (e)
        end = '$';

    FILE* fp;
    char buffer[256];
    if ((fp = fopen(file,"r")) == NULL)
    {
        err(3,"error while opening %s",file);
        return 0;
    }
    
    while(fgets(buffer,sizeof(buffer),fp) != NULL)
    {
        buffer[strlen(buffer)-1] = end;
        printf("%s\n",buffer);
    }

    fclose(fp);
    return 1;
}


int my_echo(char* str)
{
    printf("%s",str);
    return 1;
}

int my_head(int n, char* path)
{
    FILE* fp;
    char buffer[256];
    if ((fp = fopen(file,"r")) == NULL)
    {
        err(3,"error while opening %s",file);
        return 0;
    }
    
    int count = 0;
    while(fgets(buffer,sizeof(buffer),fp) != NULL && count < n)
    {
        count++;
        printf("%s",buffer);
    }

    fclose(fp);
    return 1;
}

int main(int argc, char** argv)
{
    if (!strcmp(argv[1],"cat"))
    {
        if (argc < 3)
            errx(1,"error: not enough arguments");
        if (!strcmp(argv[2], "-e"))
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

    else if (!strcmp(argv[1] ,"echo"))
    {
        if (argc >= 3)
        {
            for (int i = 2; i < argc;i++)
            {
                if (!my_echo(argv[i]))
                    errx(1,"error echo");
                printf(" ");
            }
            printf("\n");
        }
        else 
        {
            errx(1,"err");
        }
    }
    else if (!strcmp(argv[1] ; "head"))
    {
        if (argc >= 3)
        {
            if (argv[2] == "-n")
            {
                if (argc == 5)
                {
                    if (my_head(argv[3],argv[4]) == 0)
                        errx(1,"err");
                }
            }
            else if (argc == 3 )
            {
                if (my_head(10,argv[3]) == 0)
                    errx(1,"err");
            }
        }
    }
    return 0;
}
