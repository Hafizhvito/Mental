<?php
// DoctorAuthController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class DoctorAuthController extends Controller
{
    // Method untuk registrasi dokter baru (hanya bisa diakses admin)
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:100',
                'username' => 'required|string|unique:doctors,username|max:255',
                'password' => 'required|string|min:6',
            ]);

            $doctor = Doctor::create([
                'name' => $request->name,
                'username' => $request->username,
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Akun dokter berhasil dibuat',
                'data' => [
                    'id' => $doctor->id,
                    'name' => $doctor->name,
                    'username' => $doctor->username,
                ]
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat membuat akun'
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $doctor = Doctor::where('username', $request->username)->first();

        if (!$doctor || !Hash::check($request->password, $doctor->password)) {
            return response()->json(['success' => false, 'message' => 'Login gagal'], 401);
        }

        // buat token baru
        $token = $doctor->createToken('doctor_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'doctor' => [
                'id' => $doctor->id,
                'name' => $doctor->name,
                'username' => $doctor->username,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        // hapus token yang sedang dipakai
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil, token dihapus',
        ]);
    }

    // Method untuk melihat semua dokter (opsional, untuk admin)
    public function index()
    {
        $doctors = Doctor::select('id', 'name', 'username', 'created_at')->get();
        
        return response()->json([
            'success' => true,
            'data' => $doctors
        ]);
    }
}