#include <err.h>
#include <string.h>

#include "htab.h"

uint32_t hash(char *key)
{
    int len = 0;
    while (key[len] != 0)
    {
        len++;
    }

    size_t i = 0;
    uint32_t hash = 0;
    while (i != len) 
    {
        hash += key[i++];
        hash += hash << 10;
        hash ^= hash >> 6;
    }
    hash += hash << 3;
    hash ^= hash >> 11;
    hash += hash << 15;
    return hash;
}

struct htab *htab_new()
{
    // TODO
}

void htab_clear(struct htab *ht)
{
    // TODO
}

void htab_free(struct htab *ht)
{
    // TODO
}

struct pair *htab_get(struct htab *ht, char *key)
{
    // TODO
}

int htab_insert(struct htab *ht, char *key, void *value)
{
    // TODO
}

void htab_remove(struct htab *ht, char *key)
{
    // TODO
}