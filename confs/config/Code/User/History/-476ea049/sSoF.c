#include "basics.h"

size_t my_strlen(char *s)
{
    size_t res = 0;
    while (s[res] != 0)
    {
        res++;
    }
    return res;
}

char *my_strdup(char *s)
{
    size_t len = my_strlen(s);
    char* res = malloc(len * sizeof(char));
    for (size_t i = 0; i < len; i++)
    {
        res[i] = s[i];
    }
    return res;
}

int cmp(void *p1, void *p2)
{
    char* p1_char = p1;
    char* p2_char = p2;

    int i = 0;
    while(p1_char[i] == p2_char[i] && p1_char[i] != 0)
    {
        i++;
    }

    if (p1_char[i] == p2_char[i])
    {
        return 0;
    }

    else if (p1_char[i] < p2_char[i])
    {
        return -1;
    }
    else 
        return 1;
}

// REMOOOOOOOOOOOOOOOOOOOOOVE TEST
int main()
{
    char* str = "Glm_Aln";
    int len = my_strlen(str);
    char* str2 = my_strdup(str);
    int res = cmp(str,str2);
    return 1;
}
