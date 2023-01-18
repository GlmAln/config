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
    while(p1_char[i] != 0 && p2_char[i] != 0)
    {
        if (p1_char[i] > p2_char[i])
        {
            return 1;
        }
        else if (p1_char[i] < p2_char[i])
        {
            return -1;
        }
        i++;
    } 
    if (p1_char[i] == 0 && p2_char[i] == 0)
    {
        return 0;
    }
}

// // REMOOOOOOOOOOOOOOOOOOOOOVE TEST
// int main()
// {
    // char* str = "Glm_Aln";
    // int len = my_strlen(str);
    // char* str2 = "Gllm_Aln";
    // int res = cmp(str,str2);
    // return 1;
// }
