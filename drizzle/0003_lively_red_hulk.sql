ALTER TABLE "contact_views" DROP CONSTRAINT "contact_views_viewer_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "shortlists" DROP CONSTRAINT "shortlists_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "contact_views" ALTER COLUMN "viewer_user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "memberships" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "shortlists" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "contact_views" ADD CONSTRAINT "contact_views_viewer_user_id_users_clerk_id_fk" FOREIGN KEY ("viewer_user_id") REFERENCES "public"."users"("clerk_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_clerk_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("clerk_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shortlists" ADD CONSTRAINT "shortlists_user_id_users_clerk_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("clerk_id") ON DELETE cascade ON UPDATE no action;