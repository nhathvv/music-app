import { colors, fontSize } from '@/constants/tokens'
import { useAuthStore } from '@/store/auth'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const LoginScreen = () => {
	const insets = useSafeAreaInsets()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const { login, isLoading, error, clearError } = useAuthStore()

	const handleLogin = async () => {
		if (!email.trim() || !password.trim()) {
			Alert.alert('Error', 'Please fill in all fields')
			return
		}

		const success = await login({ email: email.trim(), password })
		if (success) {
			router.replace('/(tabs)')
		}
	}

	return (
		<LinearGradient colors={['#1a1a2e', '#16213e', '#0f0f23']} style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={[styles.content, { paddingTop: insets.top + 40 }]}
			>
				<View style={styles.header}>
					<Text style={styles.logo}>🎵</Text>
					<Text style={styles.title}>Music Player</Text>
					<Text style={styles.subtitle}>Sign in to continue</Text>
				</View>

				<View style={styles.form}>
					{error && (
						<View style={styles.errorContainer}>
							<Text style={styles.errorText}>{error}</Text>
							<Pressable onPress={clearError}>
								<Text style={styles.errorDismiss}>✕</Text>
							</Pressable>
						</View>
					)}

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Email</Text>
						<TextInput
							style={styles.input}
							placeholder="Enter your email"
							placeholderTextColor={colors.textMuted}
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Password</Text>
						<TextInput
							style={styles.input}
							placeholder="Enter your password"
							placeholderTextColor={colors.textMuted}
							value={password}
							onChangeText={setPassword}
							secureTextEntry
						/>
					</View>

					<Pressable
						style={[styles.button, isLoading && styles.buttonDisabled]}
						onPress={handleLogin}
						disabled={isLoading}
					>
						{isLoading ? (
							<ActivityIndicator color={colors.text} />
						) : (
							<Text style={styles.buttonText}>Sign In</Text>
						)}
					</Pressable>

					<View style={styles.footer}>
						<Text style={styles.footerText}>Don't have an account? </Text>
						<Link href="/(auth)/register" asChild>
							<Pressable>
								<Text style={styles.footerLink}>Sign Up</Text>
							</Pressable>
						</Link>
					</View>

					<Pressable style={styles.skipButton} onPress={() => router.replace('/(tabs)')}>
						<Text style={styles.skipText}>Continue as Guest</Text>
					</Pressable>
				</View>
			</KeyboardAvoidingView>
		</LinearGradient>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		paddingHorizontal: 24,
	},
	header: {
		alignItems: 'center',
		marginBottom: 48,
	},
	logo: {
		fontSize: 64,
		marginBottom: 16,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: colors.text,
		marginBottom: 8,
	},
	subtitle: {
		fontSize: fontSize.sm,
		color: colors.textMuted,
	},
	form: {
		flex: 1,
	},
	errorContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: 'rgba(239, 68, 68, 0.2)',
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
	},
	errorText: {
		color: '#ef4444',
		fontSize: fontSize.xs,
		flex: 1,
	},
	errorDismiss: {
		color: '#ef4444',
		fontSize: fontSize.sm,
		paddingLeft: 8,
	},
	inputContainer: {
		marginBottom: 20,
	},
	label: {
		fontSize: fontSize.xs,
		color: colors.textMuted,
		marginBottom: 8,
		textTransform: 'uppercase',
		letterSpacing: 1,
	},
	input: {
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		borderRadius: 12,
		padding: 16,
		fontSize: fontSize.sm,
		color: colors.text,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.1)',
	},
	button: {
		backgroundColor: colors.primary,
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: 'center',
		marginTop: 8,
	},
	buttonDisabled: {
		opacity: 0.7,
	},
	buttonText: {
		color: colors.text,
		fontSize: fontSize.sm,
		fontWeight: '600',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 24,
	},
	footerText: {
		color: colors.textMuted,
		fontSize: fontSize.sm,
	},
	footerLink: {
		color: colors.primary,
		fontSize: fontSize.sm,
		fontWeight: '600',
	},
	skipButton: {
		marginTop: 32,
		alignItems: 'center',
	},
	skipText: {
		color: colors.textMuted,
		fontSize: fontSize.xs,
		textDecorationLine: 'underline',
	},
})

export default LoginScreen

