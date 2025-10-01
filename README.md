A simple application for generating marketing concepts using AI.

## Tech Decisions

- **Next.js** and **Supabase** because that's the assignment
- **TypeScript** because of course
- Styling with **Tailwind** and **DaisyUI** so the app can look nice without having to invest too much time into style
- I chose to use **OpenAI** for the LLM, because they offer useful models, a straightforward API, and also because I already had credits in my OpenAI account
- For the model, I chose **GPT-4o Mini** because it's cost effective, fast, and good quality. I figured it would be plenty powerful for this task and I also wanted to prioritize speed

---

## Setting Up

### Formatting
- **Prettier** for consistent code formatting (a no-brainer)
- Inline Prettier config in `package.json` for simplicity 
- Comprehensive `.prettierignore` covering build outputs, dependencies, and generated files to avoid formatting conflicts and improve performance

### Environment Variables
Environment variables follow Next.js conventions:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

---

## Putting the App Together

### Layout
- Simple navigation header with a title and links to the pages of the app
- The contents of the pages are rendered inside a container
- I used DaisyUI to style these in order to keep it simple

### Home Page
- A title, subtitle, and links to the other pages. I wanted a simple landing page where the user will be introduced to the platform and be able to go straight to creating an audience or viewing concepts

### Audience Page
- Multi-section form with demographics so the user can create an audience
- Real-time validation with disabled submit until required fields are complete
- Checkbox grid for interests to allow multiple selections
- Error message that appears if there is a problem submitting the form
- After successfully submitting the form, the user will be redirected to the concepts page. The audience and related concept that was just created should be the first one listed

---

## Supabase Integration

- I created a `supabaseClient` file in the `lib` directory to configure the Supabase client
- I decided to save the audiences in Supabase as their own table. We could save just the concept in the database with all the demographic data, and that would work fine for this small demo. However, I think having separate `audiences` and `concepts` tables is best practice because it allows for more dynamic customization should we decide to add more features, and it will allow for multiple concepts per audience which will be useful once we implement remixes
- Created helper functions to handle converting camel case to snake case to address the different conventions between TypeScript and Supabase/PostgreSQL. (I ended up not needing this and deleting it.)
- I disabled row level security in the tables, and decided not to implement user authentication. Normally, this is not good practice for obvious reasons, but I thought it would be okay for this project for the following reasons:
  - We are only ever calling Supabase from the API routes, and all I am configuring is the ability to add rows to existing tables. Therefore, it won't be possible for someone to delete or edit an existing row, they can only add a new one
  - I want someone viewing this demo to be able to see the existing audiences and concepts so that they can experience the application at its fullest without the friction of creating an account and inputting all the data themselves
  - For a production level app, I would absolutely implement user auth and RLS, but for a demo like this I think it's fine leaving those out

---

## API Route for Saving the Audience

- I created a POST route at `app/api/audience` for saving the audience (I will also handle creating and saving the concept here as well)
- At first implementation, I was calling the API to save to the database directly in the React component. However, I quickly moved the API call to the new Next.js route and decided that I would only call Supabase functions in the backend

---

## Integrating OpenAI and Generating the Concept

### OpenAI Logic
- I placed the OpenAI logic in `lib/openai.ts` in order to be tidy
- I thought about placing Supabase API logic in its own file as well, but decided not to because it isn't much code and is still tidy in the API route file

### Prompt Design
- For the prompt, I ask the LLM to "create a comprehensive marketing concept for the following target audience" and provide the demographic details
- I ask for a structured marketing concept with specific values and request that the response consist of exact keys so that we can expect consistent responses
- I had to specify JSON format only with "no markdown formatting, no code blocks, no additional text." Otherwise, just asking for JSON the LLM would respond with JSON wrapped in Markdown
- I call this function from the `api/audience` file, passing in the demographics of the audience as arguments

### Saving the New Concept
- I decided to save concepts in their own table and add an `audience_id` foreign key that references the audiences table. We certainly could have settled for just one table and it would have worked fine for this project. But I have an idea for remixes that will work better with this two table approach
- In the `audience` route, I decided to generate the new concept first, because there really is no point saving the audience or concept if there is an error creating the concept
- I save both the audience and concept to the DB, but I save the audience first so that we can get the audience ID and reference it in the concept table
- I call `select()` on the Supabase functions for both tables so that we can return the values in the response. Not totally necessary for this route but I like it this way
- It could be cleaner to create a database function in Supabase in order to have a transaction that allows for saving to both tables in one function. However, our case is simple enough that I think calling these two functions is fine

---

## Concepts Page

- The concepts page displays all audiences and their associated concepts
- I added JSX styled with DaisyUI, displaying all the properties of the audiences and concepts
- I created a separate audience view component for more cleanliness and less clutter
- I defined `Concept` and `AudienceWithConcepts` types for the values of the data in the page. I moved the types to a new `types/concept.ts` file

---

## "Remix" a Concept

- For remixing, I decided to create a new concept to associate with a given audience
- The user will simply click the `remix` button under an audience description on the concepts page, this will open a modal with an "Add additional context" field. The user provides additional information and submits
- I created a new `remix-concept` API route that accepts the audience ID and the additional data, and makes a request to the OpenAI function to generate a marketing concept
- I updated the `generateMarketingConcept` function to accept `additional_context`, and I updated the prompt specifying to prioritize and acknowledge the additional context if it is present. If `additional_context` is not provided (creating the initial concept after first creating the audience), it will still behave as before
- I added error handling in the modal to display a message should there be an issue with the remix API call


## Database Schema:

```sql
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.audiences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  age_range text,
  location text,
  income text,
  interests ARRAY,
  pain_points text,
  goals text,
  CONSTRAINT audiences_pkey PRIMARY KEY (id)
);
CREATE TABLE public.concepts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text,
  description text,
  value_proposition text,
  key_messages ARRAY,
  channels ARRAY,
  tone text,
  call_to_action text,
  audience_id uuid DEFAULT gen_random_uuid(),
  CONSTRAINT concepts_pkey PRIMARY KEY (id),
  CONSTRAINT concepts_audience_id_fkey FOREIGN KEY (audience_id) REFERENCES public.audiences(id)
);
```

