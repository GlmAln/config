#include <err.h>
#include <string.h>
#include <stdio.h>

#include "htab.h"

int main()
{
    uint32_t test = hash("France");
    printf("%0x\n",test);
    test = hash("Spain");
    printf("%0x\n",test);
    test = hash("Jamaica");
    printf("%0x\n",test);
    test = hash("Turkey");
    printf("%0x\n",test);
}