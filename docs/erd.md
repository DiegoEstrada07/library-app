# Library App ERD

```mermaid
erDiagram
    USERS ||--o{ LOANS : borrows
    USERS ||--o{ PURCHASES : buys
    BOOKS ||--o{ LOANS : loaned_in
    BOOKS ||--o{ PURCHASES : purchased_in

    USERS {
        int id PK
        varchar name
        varchar email UK
        varchar password_hash
        datetime created_at
        datetime updated_at
    }

    BOOKS {
        varchar id PK
        varchar title
        varchar author
        varchar cover_url
        int first_publish_year
        int edition_count
        varchar format
        datetime created_at
        datetime updated_at
    }

    LOANS {
        int id PK
        int user_id FK
        varchar book_id FK
        date due_date
        varchar status
        datetime created_at
        datetime updated_at
    }

    PURCHASES {
        int id PK
        int user_id FK
        varchar book_id FK
        datetime purchased_at
        datetime created_at
    }
```

## Notes

- `USERS.email` should be unique.
- `LOANS` should prevent duplicated active loans for the same `user_id + book_id`.
- `PURCHASES` can enforce uniqueness by `user_id + book_id` if each ebook is bought once.
- `BOOKS.id` is string-based to align with OpenLibrary-style identifiers currently used in frontend state.
