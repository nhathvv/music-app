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
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const RegisterScreen = () => {
	const insets = useSafeAreaInsets()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const { register, isLoading, error, clearError } = useAuthStore()

	const handleRegister = async () => {
		if (!name.trim() || !email.trim() || !password.trim()) {
			Alert.alert('Error', 'Please fill in all fields')
			return
		}

		if (password !== confirmPassword) {
			Alert.alert('Error', 'Passwords do not match')
			return
		}

		if (password.length < 6) {
			Alert.alert('Error', 'Password must be at least 6 characters')
			return
		}

		const success = await register({
			name: name.trim(),
			email: email.trim(),
			password,
		})

		if (success) {
			router.replace('/(tabs)')
		}
	}

	return (
		<LinearGradient colors={['#1a1a2e', '#16213e', '#0f0f23']} style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardView}
			>
				<ScrollView
					contentContainerStyle={[styles.content, { paddingTop: insets.top + 40 }]}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.header}>
						<Text style={styles.logo}>🎵</Text>
						<Text style={styles.title}>Create Account</Text>
						<Text style={styles.subtitle}>Join us to enjoy music</Text>
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
							<Text style={styles.label}>Name</Text>
							<TextInput
								style={styles.input}
								placeholder="Enter your name"
								placeholderTextColor={colors.textMuted}
								value={name}
								onChangeText={setName}
								autoCapitalize="words"
							/>
						</View>

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
								placeholder="Create a password"
								placeholderTextColor={colors.textMuted}
								value={password}
								onChangeText={setPassword}
								secureTextEntry
							/>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.label}>Confirm Password</Text>
							<TextInput
								style={styles.input}
								placeholder="Confirm your password"
								placeholderTextColor={colors.textMuted}
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								secureTextEntry
							/>
						</View>

						<Pressable
							style={[styles.button, isLoading && styles.buttonDisabled]}
							onPress={handleRegister}
							disabled={isLoading}
						>
							{isLoading ? (
								<ActivityIndicator color={colors.text} />
							) : (
								<Text style={styles.buttonText}>Create Account</Text>
							)}
						</Pressable>

						<View style={styles.footer}>
							<Text style={styles.footerText}>Already have an account? </Text>
							<Link href="/(auth)/login" asChild>
								<Pressable>
									<Text style={styles.footerLink}>Sign In</Text>
								</Pressable>
							</Link>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</LinearGradient>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	keyboardView: {
		flex: 1,
	},
	content: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingBottom: 40,
	},
	header: {
		alignItems: 'center',
		marginBottom: 32,
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
})

export default RegisterScreen

