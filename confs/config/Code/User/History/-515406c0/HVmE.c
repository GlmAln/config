#include <stdlib.h>
#include "list.h"

void list_init(struct list *list)
{
    list->next = NULL;
}

int list_is_empty(struct list *list)
{
    return list->next == NULL;
}

size_t list_len(struct list *list)
{
    size_t count = 0;
    while (list->next != NULL)
    {
        list = list->next;
        count++;
    }
    return count;
}

void list_push_front(struct list *list, struct list *elm)
{
    struct list *temp = list->next;
    list->next = elm;
    list->next->next = temp; 
}

struct list *list_pop_front(struct list *list)
{
    // TODO
}

struct list *list_find(struct list *list, int value)
{
    // TODO
}

struct list *list_lower_bound(struct list *list, int value)
{
    // TODO
}

int list_is_sorted(struct list *list)
{
    // TODO
}

void list_insert(struct list *list, struct list *elm)
{
    // TODO
}

void list_rev(struct list *list)
{
    // TODO
}

void list_half_split(struct list *list, struct list *second)
{
    // TODO
}

int main()
{
    struct list* l = calloc(1,sizeof(struct list));
    list_init(l);
    /*for (int i = 0; i < 10; i++)
    {
        struct list* temp = {NULL, i};
        list_push_front(list, &temp);
    }*/
    return 0;
}