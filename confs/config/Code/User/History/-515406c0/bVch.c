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
    if (list_is_empty(list))
        return NULL;
    
    struct list *temp = list->next->next;
    list->next = temp;
    return list;
}

struct list *list_find(struct list *list, int value)
{
    struct list *next = list;
    while (!list_is_empty(next))
    {
        if (next->data == value)
            return next;
        next = next->next;
    }
    return NULL;
}

struct list *list_lower_bound(struct list *list, int value)
{
    struct list *next = list;
    struct list *previous = list;
    while (!list_is_empty(next))
    {
        if (next->data > value)
            return previous;
        
        previous = next;
        next = next->next;
    }
    return next;

}

int list_is_sorted(struct list *list)
{
    struct list *previous = list;
    if (list_is_empty(previous))
        return 1;
    struct list *next = previous->next;

    while (!list_is_empty(previous))
    {
        if (previous->data > next->data)
            return 0;
        previous = next;
        next = next->next;
    }
    return 1;
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
    for (int i = 10; i > 0; i--)
    {
        struct list* temp = calloc(1,sizeof(struct list));
        list_init(temp);
        temp->data = i;
        if (i == 5)
            list_pop_front(l); 
        list_push_front(l, temp);
    }
    struct list* one = list_lower_bound(l,1);
    int sorted = list_is_sorted(l);
    return 0;
}