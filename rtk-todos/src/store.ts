import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Todo {
  id: number;
  text: string;
  active: boolean;
  done: boolean;
}

export const todoApi = createApi({ //this todoApi must be then passed in the DOM-strcut in App.tsx
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  tagTypes: ["Todos"], //"same as "Todos" in providesTags: to let track the attechted tags to the cached data processed, thus if needed (done by mutation) either detete or re-fetch the cached data, till then it invliadatesTags (l.29)
  endpoints: (builder) => ({
    //getAll/addTodo etc are all method defined to intract with data/change it etc
    getAll: builder.query<Todo[], void>({ //ig builder.query need providesTags, which then once: bulder.mutatation is used: will be accesssed to link the tags and thus make async req etc ig
      query: () => `todos`,
      providesTags: [{ type: "Todos", id: "LIST" }], //note providesTags must link with the db fields names of arra etc of REST.api
    }),

    // builder.mutations invalidatesTages[] access/link up with builder.query providesTags thus invalidatesTages[] == providesTags[] in terms of SHAPE of the array
    addTodo: builder.mutation<string, string>({
      query(text) {
        return {
          url: `todos`,
          method: "POST",
          body: {
            text,
          },
        };
      },
      invalidatesTags: [{ type: "Todos", id: "LIST" }], // used to link up with Quries //invalidatesTags == defiend in mutation endpoints. for Determines which cached data should be either re-fetched or removed from the cache. Expects the same shapes as providesTags in 
    }),

    updateTodo: builder.mutation<Todo, Todo>({
      query(todo) {
        return {
          url: `todos/${todo.id}`,
          method: "PUT",
          body: todo,
        };
      },
      invalidatesTags: [{ type: "Todos", id: "LIST" }], // thus one the above code done it will link up, thus run the getAll func which then will reredner the whole page
    }),

    deleteTodo: builder.mutation<Todo, Todo>({
      query(todo) {
        return {
          url: `todos/${todo.id}`,
          method: "DELETE",
          body: todo,
        };
      },
      invalidatesTags: [{ type: "Todos", id: "LIST" }],
    }),

  }),
});
