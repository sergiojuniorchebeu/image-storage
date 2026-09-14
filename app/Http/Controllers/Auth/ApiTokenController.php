<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ApiTokenController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $user->tokens()->delete();

        $token = $user->createToken('api-key');

        return back()->with('api_token', $token->plainTextToken);
    }
}
