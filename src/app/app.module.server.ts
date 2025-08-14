import { NgModule } from '@angular/core';
import { App } from './app';
import { AppModule } from './app-module';


@NgModule({
  imports: [AppModule],
  bootstrap: [App],
})
export class AppServerModule { }
