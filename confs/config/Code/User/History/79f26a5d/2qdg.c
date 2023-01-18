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
    struct htab *res = calloc(1,sizeof(struct htab));
    res->capacity = 4;
    res ->size = 0;
    res->data = calloc(1,sizeof(struct pair));
}

void htab_clear(struct htab *ht)
{
    for(int i = 0, i < size, i++)
    {
        free(ht->data[i]);
    }
}

void htab_free(struct htab *ht)
{
    free(ht->data);
    free(ht);
}

struct pair *htab_get(struct htab *ht, char *key)
{
    uint32_t hash = hash(key);
    int pos = (int)hash % ht->capacity;
    return ht->data[pos];
}

int htab_insert(struct htab *ht, char *key, void *value)
{
// TODO
}

void htab_remove(struct htab *ht, char *key)
{
//      TODO
}
