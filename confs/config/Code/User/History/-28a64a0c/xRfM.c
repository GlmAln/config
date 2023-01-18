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
    res->data = calloc(res->capacity,sizeof(struct pair));
    if (data == NULL || res == NULL)
        errx("Not enough memory!");
}

void pair_clear(struct pair* pair)
{
    if(pair->next != NULL)
        pair_clear(pair->next);
    free(pair);
}

void htab_clear(struct htab *ht)
{
    for(int i = 0, i < ht->size, i++)
    {
        pair_clear(ht->data[i]->next);
    }
}

void htab_free(struct htab *ht)
{
    htab_clear(ht);
    free(ht->data);
    free(ht);
}

struct pair *htab_get(struct htab *ht, char *key)
{
    uint32_t hash = hash(key);
    int pos = (int)hash % ht->capacity;
    return ht->data[pos]->next;
}

int htab_insert(struct htab *ht, char *key, void *value)
{
    uint32_t hash = hash(key);
    int pos = (int)hash % ht->capacity;

    struct pair* pair = ht->data[pos]->next; 
    while (pair->next != NULL)
    {
        if (pair->key == key)
            return 0;
        pair = pair->next;
    }
    pair->next->value = value;
    pair->next->key = key;
    if (ht->size * 100 / ht->capacity > 75)
    {
        ht->capacity *= 2;
    }
    return 1;
}

void htab_remove(struct htab *ht, char *key)
{
    // TODO
}


