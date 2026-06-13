<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks.
     */
    public function index(): JsonResponse
    {
        $tasks = Task::query()
            ->with('column.board')
            ->orderBy('column_id')
            ->orderBy('position')
            ->orderBy('id')
            ->get();

        return response()->json(['data' => $tasks]);
    }

    /**
     * Store a newly created task.
     */
    public function store(Request $request): JsonResponse
    {
        $task = Task::query()->create($this->validatedTaskData($request));

        return response()->json(['data' => $task->load('column.board')], 201);
    }

    /**
     * Display the specified task.
     */
    public function show(Task $task): JsonResponse
    {
        return response()->json(['data' => $task->load('column.board')]);
    }

    /**
     * Update the specified task.
     */
    public function update(Request $request, Task $task): JsonResponse
    {
        $task->update($this->validatedTaskData($request, required: false));

        return response()->json(['data' => $task->refresh()->load('column.board')]);
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Task $task): JsonResponse
    {
        $task->delete();

        return response()->json(null, 204);
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedTaskData(Request $request, bool $required = true): array
    {
        $presenceRule = $required ? 'required' : 'sometimes';

        return $request->validate([
            'column_id' => [$presenceRule, 'integer', Rule::exists('columns', 'id')],
            'title' => [$presenceRule, 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'position' => ['sometimes', 'integer', 'min:0'],
        ]);
    }
}
