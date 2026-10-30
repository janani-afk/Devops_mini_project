<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- All data access goes through `src/services/api.ts`; it calls the Spring Boot API when `VITE_API_BASE_URL` is set, else an in-memory sample store — keeps demo data separate from production.
- Sample data lives only in `src/data/`; never import it outside the service layer.
- Stock/expiry rules live in `src/lib/status.ts` (tested in `src/test/status.test.ts`) so every page flags items the same way.
