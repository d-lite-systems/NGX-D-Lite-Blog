var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"","component":"HomeComponent"},{"path":"about","component":"AboutComponent"},{"path":"articles","component":"ArticlesComponent"},{"path":"contact","component":"ContactComponent"},{"path":"categories","component":"CategoriesComponent","canActivate":["AuthGuard"]},{"path":"medias","component":"MediasComponent","canActivate":["AuthGuard"]},{"path":"tasks","component":"TasksComponent","canActivate":["AuthGuard"]},{"path":"register","component":"RegisterComponent"},{"path":"login","component":"LoginComponent"},{"path":"logout","component":"LogoutComponent"},{"path":"profile","component":"ProfileComponent","canActivate":["AuthGuard"]},{"path":"admin","component":"AdminComponent","canActivate":["AuthAdminGuard"]},{"path":"notfound","component":"NotFoundComponent"},{"path":"**","redirectTo":"/notfound"}],"kind":"module"}]}