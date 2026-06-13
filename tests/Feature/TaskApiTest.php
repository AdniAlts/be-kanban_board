<?php

namespace Tests\Feature;

use App\Models\KanbanColumn;
use App\Models\Task;
use Database\Seeders\BoardSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_seed_creates_one_board_with_four_columns(): void
    {
        $this->seed(BoardSeeder::class);

        $this->assertDatabaseCount('boards', 1);
        $this->assertDatabaseHas('columns', ['slug' => 'to-do']);
        $this->assertDatabaseHas('columns', ['slug' => 'in-progress']);
        $this->assertDatabaseHas('columns', ['slug' => 'review']);
        $this->assertDatabaseHas('columns', ['slug' => 'done']);
    }

    public function test_task_can_be_created(): void
    {
        $this->seed(BoardSeeder::class);
        $column = KanbanColumn::query()->where('slug', 'to-do')->firstOrFail();

        $response = $this->postJson('/api/tasks', [
            'column_id' => $column->id,
            'title' => 'Create task API',
            'description' => 'Add simple task CRUD endpoint.',
            'position' => 1,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.title', 'Create task API')
            ->assertJsonPath('data.column.slug', 'to-do');

        $this->assertDatabaseHas('tasks', ['title' => 'Create task API']);
    }

    public function test_tasks_can_be_listed_and_shown(): void
    {
        $this->seed(BoardSeeder::class);
        $column = KanbanColumn::query()->where('slug', 'to-do')->firstOrFail();
        $task = Task::query()->create([
            'column_id' => $column->id,
            'title' => 'Read task API',
            'position' => 1,
        ]);

        $this->getJson('/api/tasks')
            ->assertOk()
            ->assertJsonPath('data.0.title', 'Read task API');

        $this->getJson("/api/tasks/{$task->id}")
            ->assertOk()
            ->assertJsonPath('data.title', 'Read task API');
    }

    public function test_task_can_be_updated_and_moved_to_another_column(): void
    {
        $this->seed(BoardSeeder::class);
        $todoColumn = KanbanColumn::query()->where('slug', 'to-do')->firstOrFail();
        $reviewColumn = KanbanColumn::query()->where('slug', 'review')->firstOrFail();
        $task = Task::query()->create([
            'column_id' => $todoColumn->id,
            'title' => 'Move task',
            'position' => 1,
        ]);

        $this->patchJson("/api/tasks/{$task->id}", [
            'column_id' => $reviewColumn->id,
            'title' => 'Moved task',
            'position' => 2,
        ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Moved task')
            ->assertJsonPath('data.column.slug', 'review');

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'column_id' => $reviewColumn->id,
            'title' => 'Moved task',
        ]);
    }

    public function test_task_can_be_deleted(): void
    {
        $this->seed(BoardSeeder::class);
        $column = KanbanColumn::query()->where('slug', 'done')->firstOrFail();
        $task = Task::query()->create([
            'column_id' => $column->id,
            'title' => 'Delete task API',
        ]);

        $this->deleteJson("/api/tasks/{$task->id}")->assertNoContent();

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_task_requires_an_existing_column(): void
    {
        $this->postJson('/api/tasks', [
            'column_id' => 999,
            'title' => 'Invalid column task',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('column_id');
    }
}
