#include "playlist.h"

struct playlist *init_playlist()
{
    struct playlist* res = malloc(sizeof(struct playlist));
    if (res == NULL)
    {
        return NULL;
    }
    res->size = 0;
    res->first = NULL;
    return res;
}

void destroy_playlist(struct playlist *playlist)
{
    struct song* temp = playlist->first;

    while (temp->next != playlist->first)
    {
        struct song* temp2 = temp->next;
        free(temp->artist);
        free(temp->name);
        free(temp);
        temp = temp2;
    }
}

int add_song(struct playlist *playlist, char *songname, char **artists)
{
    struct song* temp = playlist->first;
    while (temp->next != playlist->first)
    {
        if (cmp(songname, temp.name) > 0)
        {
            temp = temp->next;
        }

        else if (cmp(songname, temp.name) < 0)
        {
            struct song* queue = temp->next;
            struct song* new = malloc(sizeof(struct song));
            new->name = songname;
            new->artist = artists;
            new->prev = temp->prev;
            new->next = temp;
            temp->prev = new;
            return 1;
        }

        else
        {
            break;
        }
    }

    free(songname);
    free(artists);
    return 0;
}

int remove_song(struct playlist *playlist, char *songname)
{
    struct song* temp = playlist->first;
    while (temp->next != playlist->first)
    {
        if (cmp(songname, temp.name) == 0)
        {
            free(temp->artists);
            free(temp->name);
            temp->prev->next = temp->next;
            temp->next->prev = temp->prev;
            free(temp);
            return 1;
        }
    }
    return 0;
}
void print_playlist(struct playlist *playlist)
{
    int count = 1;
    while(playlist->first != playlist->first->next)
    {
        printf("SONG %i : %s FROM ",count,playlist->first->name);
        int i = 0;
        while (playlist->first->artists[i] != NULL)
        {
            if (i == 0)
            {
                printf("%s",playlist->first->artists[i]);
            }
            else
            {
                printf(",%s",playlist->first->artists[i]);
            }
        }
        printf(".\n");
        playlist->first = playlist->first->next;
    }
}

void print_playlist_reverse(struct playlist *playlist)
{
    int count = 1;
    while(playlist->first != playlist->first->prev)
    {
        printf("SONG %i : %s FROM ",count,playlist->first->name);
        int i = 0;
        while (playlist->first->artists[i] != NULL)
        {
            if (i == 0)
            {
                printf("%s",playlist->first->artists[i]);
            }
            else
            {
                printf(",%s",playlist->first->artists[i]);
            }
        }
        printf(".\n");
        playlist->first = playlist->first->prev;
    }
}

char **get_songs_from_artist(struct playlist *playlist, char *artist)
{

}