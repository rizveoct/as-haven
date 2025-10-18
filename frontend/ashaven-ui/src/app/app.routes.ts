import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ProjectsComponent } from './pages/project/project.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ContactComponent } from './pages/contact/contact.component';
import { GalleryPageComponent } from './pages/gallery-page/gallery-page.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './pipes/auth-guard';
import { DashboardHomeComponent } from './features/dashboard/dashboard-home/dashboard-home.component';
import { ProjectsIndexComponent } from './features/projects/projects-index/projects-index.component';
import { ProjectCreateComponent } from './features/projects/project-create/project-create.component';
import { ProjectEditComponent } from './features/projects/project-edit/project-edit.component';
import { ProjectFeaturesComponent } from './features/projects/project-features/project-features.component';
import { ProjectGalleryComponent } from './features/projects/project-gallery/project-gallery.component';
import { TeamsIndexComponent } from './features/teams/teams-index/teams-index.component';
import { ClientComponent } from './features/client/client.component';
import { BlogsIndexComponent } from './features/blogs/blogs-index/blogs-index.component';
import { OffersIndexComponent } from './features/offers/offers-index/offers-index.component';
import { AboutUsIndexComponent } from './features/about-us/about-us-index/about-us-index.component';
import { FaqComponent } from './features/faq/faq.component';
import { GalleryComponent } from './features/gallery/gallery.component';
import { TestimonialsIndexComponent } from './features/testimonials/testimonials-index/testimonials-index.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title:
        'Ashaven Developers Ltd | Trusted Real Estate in Rajshahi, Bangladesh',
      description:
        'Ashaven Developers Ltd is a premier real estate developer in Rajshahi, Bangladesh, offering quality residential, commercial and mixed-use projects. Discover your dream home with us.',
    },
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title:
        'Ashaven Developers Ltd | Trusted Real Estate in Rajshahi, Bangladesh',
      description:
        'Ashaven Developers Ltd is a premier real estate developer in Rajshahi, Bangladesh, offering quality residential, commercial and mixed-use projects. Discover your dream home with us.',
    },
  },
  {
    path: 'about',
    component: AboutComponent,
    data: {
      title: 'About Ashaven Developers Ltd | Real Estate Company in Rajshahi',
      description:
        'Learn about Ashaven Developers Ltd — our vision, mission, team and commitment to quality construction in Rajshahi. Building sustainable & trusted real estate since',
    },
  },
  {
    path: 'gallery',
    component: GalleryPageComponent,
    data: {
      title:
        'Project Gallery | Ashaven Developers Ltd — Real Estate Projects in Rajshahi',
      description:
        'Explore Ashaven Developers’ photo gallery featuring our latest residential and commercial projects in Rajshahi. See interiors, exteriors, and on-site progress.',
    },
  },
  {
    path: 'blogs',
    component: BlogComponent,
    data: {
      title:
        'Ashaven Developers Blog | Real Estate Tips & Property Insights in Bangladesh',
      description:
        'Stay updated with Ashaven Developers’ latest real estate tips, property investment guides, housing trends, and construction news in Rajshahi and across Bangladesh.',
    },
  },
  {
    path: 'blogs/:id',
    component: BlogDetailsComponent,
    data: {
      title: 'Blog Details | Ashaven Developers Ltd',
      description:
        'Read detailed insights on real estate, property investment, and construction trends from Ashaven Developers in Rajshahi and Bangladesh.',
    },
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    data: {
      title: 'Our Projects | Ashaven Developers Ltd — Rajshahi Properties',
      description:
        'Explore the latest residential, commercial, and mixed-use projects by Ashaven Developers in Rajshahi. View galleries, project features, floor plans & pricing.',
    },
  },
  {
    path: 'projectdetails/:id',
    component: ProjectDetailsComponent,
    data: {
      title: 'Project Details | Ashaven Developers Ltd',
      description:
        'Discover detailed information, features, floor plans, and pricing of Ashaven Developers’ real estate projects in Rajshahi.',
    },
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: {
      title: 'Contact Ashaven Developers Ltd | Get in Touch — Rajshahi, BD',
      description:
        'Need more info or want to visit a property? Contact Ashaven Developers Ltd in Rajshahi. Call us, email us or visit our office to discuss your real estate needs.',
    },
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'teams', component: TeamsIndexComponent },
      { path: 'clients', component: ClientComponent },
      { path: 'testimonials', component: TestimonialsIndexComponent },
      { path: 'blogs', component: BlogsIndexComponent },
      { path: 'offers', component: OffersIndexComponent },
      { path: 'about-us', component: AboutUsIndexComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'gallery', component: GalleryComponent },
      {
        path: 'projects',
        children: [
          { path: '', component: ProjectsIndexComponent },
          { path: 'create', component: ProjectCreateComponent },
          { path: ':id/edit', component: ProjectEditComponent },
          { path: ':id/features', component: ProjectFeaturesComponent },
          { path: ':id/gallery', component: ProjectGalleryComponent },
        ],
      },
    ],
  },
];
