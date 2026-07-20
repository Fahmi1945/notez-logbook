This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

## Frontend Structure

```text
frontend/
	.env
	.env.example
	.gitignore
	AGENTS.md
	ARSITEKTUR.md
	CLAUDE.md
	docker-compose.yml
	Dockerfile
	eslint.config.mjs
	next-env.d.ts
	next.config.ts
	package.json
	postcss.config.mjs
	README.md
	tsconfig.json
	src/
		middleware.ts
		app/
			(auth)/
				layout.tsx
				login/
					page.tsx
				register/
					page.tsx
			(user)/
				layout.tsx
				dashboard/
					page.tsx
				logbook/
					page.tsx
					new/
						page.tsx
					[id]/
						page.tsx
						edit/
							page.tsx
				mentorship/
					page.tsx
				profile/
					page.tsx
			mentor/
				layout.tsx
				dashboard/
					page.tsx
				profile/
					page.tsx
				review/
					page.tsx
					[id]/
						page.tsx
				students/
					page.tsx
			globals.css
			layout.tsx
			not-found.tsx
			page.tsx
		components/
			auth/
				auth-wrapper.tsx
				captcha.tsx
				login-form.tsx
				register-form.tsx
			dashboard/
				activity-chart.tsx
				stat-card.tsx
			layout/
				Footer.tsx
				Navbar.tsx
				notification-bell.tsx
				Sidebar.tsx
			logbook/
				attachment-upload.tsx
				entry-card.tsx
				entry-filter.tsx
				entry-form.tsx
				entry-list.tsx
			mentorship/
				mentor-list.tsx
				request-action.tsx
				request-list.tsx
			review/
				pdf-viewer.tsx
				review-form.tsx
			ui/
				badge.tsx
				Button.tsx
				card.tsx
				dropdown.tsx
				Input.tsx
				modal.tsx
				Select.tsx
				skeleton.tsx
				spinner.tsx
				textarea.tsx
				toast.tsx
		config/
			api.ts
			constants.ts
		hooks/
			use-auth.ts
			use-entries.ts
			use-mentorship.ts
			use-notifications.ts
		lib/
			auth-session.ts
			constants.ts
			utils.ts
			api/
				auth.ts
				client.ts
				entries.ts
				mentorship.ts
				notifications.ts
				reports.ts
			validators/
				auth.schema.ts
				entry.schema.ts
				mentorship.schema.ts
		store/
			auth-store.ts
			notification-store.ts
			ui-store.ts
		types/
			api.ts
			entry.ts
			mentorship.ts
			notification.ts
			user.ts
```

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Notes

- The app uses the Next.js App Router.
- Route groups like `(auth)` and `(user)` organize layouts without changing URLs.
- Shared UI components are stored in `src/components/ui`.
