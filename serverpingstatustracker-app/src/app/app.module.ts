import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { NotificationModule } from './notification.module';

import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { ServersComponent } from './components/servers/servers.component';
import { HeaderComponent } from './components/header/header.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { AddServerModalComponent } from './components/modals/add-server-modal/add-server-modal.component';
import { EditServerModalComponent } from './components/modals/edit-server-modal/edit-server-modal.component';
import { ImportServersModalComponent } from './components/modals/import-servers-modal/import-servers-modal.component';

const appRoutes: Routes = [
  { path: '', component: ServersComponent },
  { path: 'about', component: AboutPageComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    ServersComponent,
    HeaderComponent,
    AboutPageComponent,
    AddServerModalComponent,
    EditServerModalComponent,
    ImportServersModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NotificationModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false }),
  ],
  providers: [ServersComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
