#pragma once
#include "basic.h"

struct song
{
    struct song *next;
    struct song *prev;
    char *name;
    char **artists;
};

struct playlist
{
    struct song *first;
    int size;
};