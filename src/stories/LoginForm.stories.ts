import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { LoginPage } from '../app/components/login-page/login-page';
import { fn } from 'storybook/test';
import { provideMockStore } from '@ngrx/store/testing';
import { moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const meta: Meta<LoginPage> = {
  title: 'Auth/LoginForm',
  component: LoginPage,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSnackBarModule,
      ],
    }),
    applicationConfig({
      providers: [provideMockStore()],
    }),
  ],
  parameters: {
    actions: {
      handles: ['click button[type="submit"]'],
    },
  },
  args: {
    onClick: fn(),
  },
  argTypes: {
    onClick: {
      action: 'login submitted',
      description: 'Emitted when the login form is submitted',
    },
  },
};

export default meta;

type Story = StoryObj<LoginPage>;

export const Default: Story = {
  args: { username: 'testuser', password: 'password123' },
};

export const WithRememberMe: Story = {
  args: {
    rememberMeEnabled: true,
  },
};

export const InvalidForm: Story = {
  args: {
    invalid: true,
  },
};
