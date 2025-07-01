<?php

namespace App\Http\Controllers\Core;

use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Models\Core\RbacPermission;
use Illuminate\Http\Request;

class RbacPermissionController extends Controller {
    /**
     * Display a listing of the records.
     */
    public function index(Request $request) {
        $authUser = $request->user();

        // check if user is an admin
        if (!$authUser->is_admin) {
            return response()->json([
                'message' => 'Access denied.',
            ], 403);
        }

        // Get all query parameters
        $queryParams = $request->all();

        try {
            // Initialize the query builder
            $query = RbacPermission::query();

            // Apply query parameters
            QueryHelper::apply($query, $queryParams);

            // Execute the query and get the records
            $records = $query->get();
        } catch (\Exception $e) {
            // Handle exceptions and return an error response
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }

        // Return the records
        return response()->json($records, 200);
    }

    /**
     * Display the specified record.
     */
    public function show(Request $request, $id) {
        $authUser = $request->user();

        // check if user is an admin
        if (!$authUser->is_admin) {
            return response()->json([
                'message' => 'Access denied.',
            ], 403);
        }

        // Find the record by ID
        $record = RbacPermission::where('id', $id)
            ->first();

        if (!$record) {
            // Return a 404 response if the record is not found
            return response()->json([
                'message' => 'Record not found.',
            ], 404);
        }

        // Return the record
        return response()->json($record, 200);
    }

    /**
     * Store a newly created record in storage.
     */
    public function store(Request $request) {
        $authUser = $request->user();

        // check if user is an admin
        if (!$authUser->is_admin) {
            return response()->json([
                'message' => 'Access denied.',
            ], 403);
        }

        try {
            // Check if the role already exists
            $roleExists = RbacPermission::where('value', $request->input('value'))->exists();

            if ($roleExists) {
                // Return a 400 response if the role already exists
                return response()->json([
                    'message' => 'Rbac Role already exists.',
                ], 400);
            }

            // Create a new record
            $record = RbacPermission::create($request->all());

            // Return the created record
            return response()->json($record, 201);
        } catch (\Exception $e) {
            // Handle exceptions and return an error response
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Update the specified record in storage.
     */
    public function update(Request $request, $id) {
        $authUser = $request->user();

        // check if user is an admin
        if (!$authUser->is_admin) {
            return response()->json([
                'message' => 'Access denied.',
            ], 403);
        }

        try {
            // Find the role by ID
            $role = RbacPermission::find($id);

            if (!$role) {
                // Return a 404 response if the role is not found
                return response()->json([
                    'message' => 'Role not found.',
                ], 404);
            }

            // Update the role
            $role->update($request->all());

            // Return the updated role
            return response()->json($role);
        } catch (\Exception $e) {
            // Handle exceptions and return an error response
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove the specified record from storage.
     */
    public function destroy(Request $request, $id) {
        $authUser = $request->user();

        // check if user is an admin
        if (!$authUser->is_admin) {
            return response()->json([
                'message' => 'Access denied.',
            ], 403);
        }

        try {
            // Find the role by ID
            $role = RbacPermission::find($id);

            if (!$role) {
                // Return a 404 response if the role is not found
                return response()->json([
                    'message' => 'Role not found.',
                ], 404);
            }

            // Delete the role
            $role->delete();

            // Return the deleted role
            return response()->json($role, 200);
        } catch (\Exception $e) {
            // Handle exceptions and return an error response
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Display a paginated list of records with optional filtering and search.
     */
    public function paginate(Request $request) {
        $authUser = $request->user();

        // check if user is an admin
        if (!$authUser->is_admin) {
            return response()->json([
                'message' => 'Access denied.',
            ], 403);
        }

        // Get all query parameters
        $queryParams = $request->all();

        try {
            // Initialize the query builder
            $query = RbacPermission::query();

            // Define the default query type
            $type = 'paginate';
            // Apply query parameters
            QueryHelper::apply($query, $queryParams, $type);

            // Check if a search parameter is present in the request
            if ($request->has('search')) {
                $search = $request->input('search');
                // Apply search conditions to the query
                $query->where(function ($query) use ($search) {
                    $query->where('label', 'LIKE', '%'.$search.'%')
                        ->orWhere('value', 'LIKE', '%'.$search.'%');
                });
            }

            // Get the total count of records matching the query
            $total = $query->count();

            // Retrieve pagination parameters from the request
            $limit = $request->input('limit', 10);
            $page = $request->input('page', 1);
            // Apply limit and offset to the query
            QueryHelper::applyLimitAndOffset($query, $limit, $page);

            // Execute the query and get the records
            $records = $query->get();

            // Return the records and pagination info
            return response()->json([
                'records' => $records,
                'info' => [
                    'total' => $total,
                    'pages' => ceil($total / $limit),
                ],
            ]);
        } catch (\Exception $e) {
            // Handle exceptions and return an error response
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
