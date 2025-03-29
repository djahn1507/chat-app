import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  imports: [ChatComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';
}
