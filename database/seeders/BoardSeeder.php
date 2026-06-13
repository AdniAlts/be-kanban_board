<?php

namespace Database\Seeders;

use App\Models\Board;
use Illuminate\Database\Seeder;

class BoardSeeder extends Seeder
{
    private const COLUMNS = [
        ['name' => 'To-do', 'slug' => 'to-do', 'position' => 1],
        ['name' => 'In Progress', 'slug' => 'in-progress', 'position' => 2],
        ['name' => 'Review', 'slug' => 'review', 'position' => 3],
        ['name' => 'Done', 'slug' => 'done', 'position' => 4],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $board = Board::query()->updateOrCreate(
            ['slug' => 'main-board'],
            ['name' => 'Main Board'],
        );

        foreach (self::COLUMNS as $column) {
            $board->columns()->updateOrCreate(
                ['slug' => $column['slug']],
                [
                    'name' => $column['name'],
                    'position' => $column['position'],
                ],
            );
        }
    }
}
