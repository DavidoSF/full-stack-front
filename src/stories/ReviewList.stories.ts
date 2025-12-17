import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { fn } from 'storybook/test';

interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
  ],
  template: `
    <mat-card class="review-list-card">
      <mat-card-header>
        <mat-card-title>
          <div class="header-content">
            <div class="title-section">
              <h2>Customer Reviews</h2>
              <span class="review-count">({{ reviews.length }} reviews)</span>
            </div>
            @if (showFilters) {
              <div class="filters">
                <mat-chip-listbox class="rating-filter">
                  @for (star of [5, 4, 3, 2, 1]; track star) {
                    <mat-chip-option (click)="handleFilterChange(star)">
                      <mat-icon>star</mat-icon>
                      {{ star }}
                    </mat-chip-option>
                  }
                  <mat-chip-option (click)="handleFilterChange(null)">All</mat-chip-option>
                </mat-chip-listbox>
              </div>
            }
          </div>
        </mat-card-title>
      </mat-card-header>

      <mat-card-content>
        @if (reviews.length === 0) {
          <div class="empty-state">
            <mat-icon>rate_review</mat-icon>
            <p>No reviews yet. Be the first to review!</p>
          </div>
        } @else {
          <div class="reviews-container">
            @for (review of reviews; track review.id) {
              <div class="review-item">
                <div class="review-header">
                  <div class="user-info">
                    <div class="avatar">
                      <mat-icon>account_circle</mat-icon>
                    </div>
                    <div class="user-details">
                      <span class="username">{{ review.username }}</span>
                      <span class="date">{{ formatDate(review.createdAt) }}</span>
                    </div>
                  </div>
                  <div class="rating">
                    @for (star of [1, 2, 3, 4, 5]; track star) {
                      <mat-icon [class.filled]="star <= review.rating">
                        {{ star <= review.rating ? 'star' : 'star_border' }}
                      </mat-icon>
                    }
                  </div>
                </div>
                <p class="comment">{{ review.comment }}</p>
                <mat-divider />
              </div>
            }
          </div>
        }
      </mat-card-content>

      @if (showAddButton) {
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="handleAddReview()">
            <mat-icon>add</mat-icon>
            Write a Review
          </button>
        </mat-card-actions>
      }
    </mat-card>
  `,
  styles: [
    `
      .review-list-card {
        max-width: 800px;
        margin: 20px;
      }

      .header-content {
        width: 100%;
      }

      .title-section {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }

        .review-count {
          color: #666;
          font-size: 16px;
        }
      }

      .filters {
        margin-top: 12px;

        .rating-filter {
          display: flex;
          gap: 8px;
        }
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #999;

        mat-icon {
          font-size: 64px;
          width: 64px;
          height: 64px;
          margin-bottom: 16px;
        }

        p {
          font-size: 16px;
        }
      }

      .reviews-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .review-item {
        padding: 16px 0;

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          .user-info {
            display: flex;
            gap: 12px;
            align-items: center;

            .avatar {
              mat-icon {
                font-size: 40px;
                width: 40px;
                height: 40px;
                color: #666;
              }
            }

            .user-details {
              display: flex;
              flex-direction: column;

              .username {
                font-weight: 600;
                font-size: 16px;
              }

              .date {
                color: #999;
                font-size: 14px;
              }
            }
          }

          .rating {
            display: flex;
            gap: 4px;

            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;
              color: #ddd;

              &.filled {
                color: #ffa726;
              }
            }
          }
        }

        .comment {
          color: #333;
          line-height: 1.6;
          margin: 12px 0;
        }

        mat-divider {
          margin-top: 16px;
        }

        &:last-child mat-divider {
          display: none;
        }
      }

      mat-card-actions {
        padding: 16px;
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
class ReviewListComponent {
  @Input() reviews: Review[] = [];
  @Input() showFilters = true;
  @Input() showAddButton = true;
  @Output() onFilterChange = new EventEmitter<number | null>();
  @Output() onAddReview = new EventEmitter<void>();

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  handleFilterChange(rating: number | null) {
    this.onFilterChange.emit(rating);
  }

  handleAddReview() {
    this.onAddReview.emit();
  }
}

const meta: Meta<ReviewListComponent> = {
  component: ReviewListComponent,
  title: 'Shop/ReviewList',
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
        MatSelectModule,
        MatChipsModule,
      ],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    reviews: {
      control: 'object',
      description: 'Array of review objects to display',
    },
    showFilters: {
      control: 'boolean',
      description: 'Show rating filter chips',
    },
    showAddButton: {
      control: 'boolean',
      description: 'Show "Write a Review" button',
    },
    onFilterChange: {
      action: 'filter-changed',
      description: 'Emitted when user selects a rating filter',
    },
    onAddReview: {
      action: 'add-review-clicked',
      description: 'Emitted when "Write a Review" button is clicked',
    },
  },
};

export default meta;

type Story = StoryObj<ReviewListComponent>;

const sampleReviews: Review[] = [
  {
    id: '1',
    username: 'JohnDoe',
    rating: 5,
    comment:
      'Excellent product! Exceeded my expectations. The quality is top-notch and delivery was fast.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    username: 'JaneSmith',
    rating: 4,
    comment: 'Very good product. Minor issues with packaging but overall satisfied.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    username: 'MikeWilson',
    rating: 5,
    comment: 'Perfect! Will definitely buy again. Great value for money.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    username: 'SarahBrown',
    rating: 3,
    comment: 'It works as expected but nothing special. Average quality.',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const Default: Story = {
  args: {
    reviews: sampleReviews,
    showFilters: true,
    showAddButton: true,
    onFilterChange: fn(),
    onAddReview: fn(),
  },
};

export const Empty: Story = {
  args: {
    reviews: [],
    showFilters: false,
    showAddButton: true,
    onFilterChange: fn(),
    onAddReview: fn(),
  },
};

export const NoFilters: Story = {
  args: {
    reviews: sampleReviews,
    showFilters: false,
    showAddButton: true,
    onFilterChange: fn(),
    onAddReview: fn(),
  },
};

export const SingleReview: Story = {
  args: {
    reviews: [sampleReviews[0]],
    showFilters: true,
    showAddButton: false,
    onFilterChange: fn(),
    onAddReview: fn(),
  },
};

export const HighRatingsOnly: Story = {
  args: {
    reviews: sampleReviews.filter((r) => r.rating >= 4),
    showFilters: true,
    showAddButton: true,
    onFilterChange: fn(),
    onAddReview: fn(),
  },
};

export const ManyReviews: Story = {
  args: {
    reviews: [
      ...sampleReviews,
      {
        id: '5',
        username: 'AlexJohnson',
        rating: 4,
        comment: 'Good quality, would recommend to friends.',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '6',
        username: 'EmilyDavis',
        rating: 5,
        comment: 'Amazing! Best purchase ever.',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    showFilters: true,
    showAddButton: true,
    onFilterChange: fn(),
    onAddReview: fn(),
  },
};
