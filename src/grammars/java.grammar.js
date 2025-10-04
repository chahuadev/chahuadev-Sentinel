// ======================================================================
// @author บริษัท ชาหัว ดีเวลลอปเมนต์ จำกัด (Chahua Development Co., Ltd.)
// @version 1.0.0
// @license MIT
// @contact chahuadev@gmail.com
// ======================================================================
// ChahuadevR Engine Grammar Dictionary - Core Language Support
// - Java Language Specification (JLS) SE 21
// ============================================================================
// Trie Data Structure for Efficient Keyword Lookup
// ครอบคลุม: Java SE 8 - SE 21
// ============================================================================

export const JAVA_GRAMMAR = {
    // ============================================================================
    // KEYWORDS - ANTLR Java Lexer
    // ============================================================================
    keywords: {
        // Declaration Keywords
        'abstract': {
            category: 'modifier',
            source: 'ANTLR',
            javaVersion: 'SE1.0',
            description: 'Abstract class or method modifier',

            // 1. Syntactic Relationships
            followedBy: ['class', 'interface', 'IDENTIFIER'],
            precededBy: ['public', 'protected', 'private', 'NEWLINE'],
            parentContext: ['ClassDeclaration', 'MethodDeclaration', 'InterfaceDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            isModifier: true,

            // 2. Parser Directives
            isModifier: true,
            isAbstract: true,
            canCombineWith: ['public', 'protected', 'static'],
            mutuallyExclusive: ['final', 'private', 'native', 'synchronized'],
            requiresImplementation: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'abstract class vs abstract method',
                    contexts: [
                        'abstract class X {} // Abstract class',
                        'abstract void method(); // Abstract method (no body)'
                    ]
                }
            ],

            // 4. Error Reporting
            errorMessage: "Abstract methods cannot have a body. Abstract classes cannot be instantiated.",
            commonTypos: ['abstact', 'absract', 'abstarct', 'abstrac'],
            notes: 'Cannot be final or private. Abstract methods require subclass implementation.',
            quirks: [
                'Abstract class can have concrete methods',
                'Abstract method has no body',
                'Cannot instantiate abstract class',
                'Cannot be final (contradiction)',
                'Cannot be private (must be overridden)'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE1.0',
            bestPractice: 'Use for incomplete implementations that require subclass completion.',
            useCases: [
                'Abstract base classes',
                'Template method pattern',
                'Enforcing subclass implementation'
            ],
            example: 'public abstract class Shape { abstract void draw(); }',
            incompatibleWith: ['final', 'private', 'native', 'synchronized']
        },

        'class': {
            category: 'declaration',
            source: 'ANTLR',
            javaVersion: 'SE1.0',
            description: 'Class declaration keyword',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER'],
            precededBy: ['public', 'abstract', 'final', 'static', 'NEWLINE'],
            parentContext: ['CompilationUnit', 'ClassBody'],
            startsExpr: false,
            beforeExpr: false,
            isDeclaration: true,

            // 2. Parser Directives
            isDeclaration: true,
            isType: true,
            canHaveModifiers: true,
            canExtend: true,
            canImplement: true,
            canBeNested: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'class vs .class literal',
                    contexts: [
                        'class MyClass {} // Declaration',
                        'Class<?> c = String.class; // Class literal'
                    ]
                }
            ],

            // 4. Error Reporting
            errorMessage: "Class must have a name and body.",
            commonTypos: ['clas', 'calss', 'clss', 'claass'],
            notes: 'Single inheritance only. Can implement multiple interfaces.',
            quirks: [
                'Only one public class per file',
                'Filename must match public class name',
                'Single inheritance (extends one class)',
                'Multiple interface implementation',
                'Inner classes have access to outer class'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE1.0',
            bestPractice: 'One public class per file. Use clear, descriptive names.',
            classTypes: [
                'Top-level class',
                'Inner class',
                'Static nested class',
                'Local class',
                'Anonymous class'
            ],
            useCases: [
                'Object blueprints',
                'Encapsulation',
                'Inheritance hierarchies'
            ],
            example: 'public class User extends Person implements Serializable {}',
            nestedClass: 'class Outer { class Inner {} }',
            staticNestedClass: 'class Outer { static class Nested {} }'
        },

        'interface': {
            category: 'declaration',
            source: 'ANTLR',
            javaVersion: 'SE1.0',
            description: 'Interface declaration keyword',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER'],
            precededBy: ['public', '@interface', 'NEWLINE'],
            parentContext: ['CompilationUnit', 'ClassBody'],
            startsExpr: false,
            beforeExpr: false,
            isDeclaration: true,

            // 2. Parser Directives
            isDeclaration: true,
            isInterface: true,
            isContract: true,
            canExtendMultiple: true,
            implicitlyAbstract: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'interface vs @interface (annotation)',
                    contexts: [
                        'interface MyInterface {} // Interface',
                        '@interface MyAnnotation {} // Annotation type'
                    ]
                }
            ],

            // 4. Error Reporting
            errorMessage: "Interface cannot have instance fields or constructors.",
            commonTypos: ['interace', 'interfce', 'intrface', 'interfac'],
            notes: 'All methods implicitly public abstract. Fields implicitly public static final.',
            quirks: [
                'Multiple inheritance (extends multiple interfaces)',
                'All fields are public static final',
                'Methods are public abstract (pre-Java 8)',
                'Default methods since Java 8',
                'Static methods since Java 8',
                'Private methods since Java 9'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE1.0',
            bestPractice: 'Use for defining contracts. Prefer default methods over abstract classes when possible.',
            evolution: [
                'SE1.0: Abstract methods only',
                'SE8: Default and static methods',
                'SE9: Private methods',
                'SE16: sealed interfaces'
            ],
            useCases: [
                'API contracts',
                'Multiple inheritance',
                'Callback interfaces',
                'Functional interfaces (SAM)'
            ],
            example: 'public interface Drawable { void draw(); }',
            defaultMethod: 'default void log() { System.out.println("Logging"); }',
            functionalInterface: '@FunctionalInterface interface Predicate<T> { boolean test(T t); }'
        },

        'enum': {
            category: 'declaration',
            source: 'ANTLR',
            javaVersion: 'SE5',
            description: 'Enum type declaration (Java 5+)',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER'],
            precededBy: ['public', 'private', 'protected', 'static'],
            parentContext: ['CompilationUnit', 'ClassBody'],
            startsExpr: false,
            beforeExpr: false,
            isDeclaration: true,

            // 2. Parser Directives
            isDeclaration: true,
            isEnum: true,
            isType: true,
            implicitlyFinal: true,
            implicitlyStatic: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'enum is special class type',
                    note: 'Extends java.lang.Enum implicitly'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Enum cannot extend other classes (implicitly extends Enum).",
            commonTypos: ['enmum', 'enm', 'enu', 'enumm'],
            notes: 'Type-safe enums. Can have fields, methods, constructors.',
            quirks: [
                'Implicitly extends java.lang.Enum',
                'Cannot extend other classes',
                'Can implement interfaces',
                'Constants are public static final',
                'Can have constructors (private/package)',
                'Singleton pattern by default'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE5',
            bestPractice: 'Use enum for fixed sets of constants. Add methods for behavior.',
            useCases: [
                'Named constants',
                'Finite state machines',
                'Strategy pattern',
                'Command pattern'
            ],
            example: 'enum Day { MONDAY, TUESDAY, WEDNESDAY }',
            withFields: 'enum Planet { EARTH(5.976e24, 6.37814e6); }',
            withMethods: 'enum Operation { PLUS { int apply(int x, int y) { return x + y; } } }'
        },

        'record': {
            category: 'declaration',
            source: 'ANTLR',
            javaVersion: 'SE16',
            description: 'Record class declaration (Java 16+)',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER'],
            precededBy: ['public', 'private', 'protected', 'static', 'final'],
            parentContext: ['CompilationUnit', 'ClassBody'],
            startsExpr: false,
            beforeExpr: false,
            isDeclaration: true,

            // 2. Parser Directives
            isDeclaration: true,
            isRecord: true,
            implicitlyFinal: true,
            immutableClass: true,
            autoGeneratesCode: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'record is special immutable class',
                    note: 'Generates constructor, getters, equals, hashCode, toString'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Records are implicitly final and cannot be extended.",
            commonTypos: ['recod', 'reord', 'recrd', 'recor'],
            notes: 'Immutable data carriers. Auto-generates boilerplate code.',
            quirks: [
                'Implicitly final (cannot be extended)',
                'Cannot extend other classes',
                'All fields are final',
                'Auto-generates: constructor, getters, equals, hashCode, toString',
                'Can implement interfaces',
                'Can have static members and methods'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE16',
            preview: 'SE14, SE15',
            bestPractice: 'Use for immutable data transfer objects. Prefer over POJOs.',
            useCases: [
                'Data transfer objects (DTO)',
                'Immutable value objects',
                'Return types for multiple values',
                'Pattern matching targets'
            ],
            example: 'record Point(int x, int y) {}',
            withMethods: 'record Person(String name, int age) { String greeting() { return "Hi"; } }',
            compactConstructor: 'record Range(int min, int max) { public Range { if (min > max) throw new IllegalArgumentException(); } }'
        },

        'sealed': {
            category: 'modifier',
            source: 'ANTLR',
            javaVersion: 'SE17',
            description: 'Sealed class/interface modifier (Java 17+)',

            // 1. Syntactic Relationships
            followedBy: ['class', 'interface'],
            precededBy: ['public', 'abstract', 'NEWLINE'],
            parentContext: ['ClassDeclaration', 'InterfaceDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            isModifier: true,

            // 2. Parser Directives
            isModifier: true,
            isSealed: true,
            requiresPermits: true,
            restrictInheritance: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'sealed restricts which classes can extend/implement',
                    note: 'Requires permits clause to list allowed subtypes'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Sealed classes must specify permitted subclasses with 'permits' clause.",
            commonTypos: ['seled', 'selaed', 'seald', 'seaeld'],
            notes: 'Restricts inheritance hierarchy. Subclasses must be final, sealed, or non-sealed.',
            quirks: [
                'Requires permits clause',
                'Permitted subtypes must be: final, sealed, or non-sealed',
                'Subtypes must be in same package or module',
                'Enables exhaustiveness in pattern matching',
                'Permits clause can be inferred in same file'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE17',
            preview: 'SE15, SE16',
            bestPractice: 'Use for controlled inheritance hierarchies and pattern matching.',
            useCases: [
                'Algebraic data types',
                'Controlled inheritance',
                'Pattern matching exhaustiveness',
                'Domain modeling'
            ],
            example: 'sealed class Shape permits Circle, Rectangle, Triangle {}',
            withInference: 'sealed class Shape { final class Circle extends Shape {} }',
            patternMatching: 'Enables exhaustive switch over sealed type hierarchy'
        },

        'non-sealed': {
            category: 'modifier',
            source: 'ANTLR',
            javaVersion: 'SE17',
            description: 'Non-sealed subclass modifier (Java 17+)',

            // 1. Syntactic Relationships
            followedBy: ['class', 'interface'],
            precededBy: ['public', 'NEWLINE'],
            parentContext: ['ClassDeclaration', 'InterfaceDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            isModifier: true,

            // 2. Parser Directives
            isModifier: true,
            isNonSealed: true,
            reopensHierarchy: true,
            requiresSealedParent: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'non-sealed reopens sealed hierarchy',
                    note: 'Allows unrestricted subclassing of sealed parent'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'non-sealed' can only be applied to permitted subtypes of sealed classes.",
            commonTypos: ['nonsealed', 'non-selaed', 'nonseald', 'non sealed'],
            notes: 'Reopens sealed hierarchy for extension. Must be direct subtype of sealed class.',
            quirks: [
                'Hyphenated keyword (non-sealed)',
                'Must extend/implement sealed type',
                'Allows unrestricted further subclassing',
                'Alternative to final or sealed',
                'Only for sealed hierarchies'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE17',
            preview: 'SE15, SE16',
            bestPractice: 'Use sparingly. Reopening hierarchy defeats purpose of sealed.',
            useCases: [
                'Allowing extension at specific points',
                'Plugin architectures',
                'Framework extensibility'
            ],
            example: 'non-sealed class ExtensibleShape extends Shape {}',
            hierarchy: 'sealed Shape  non-sealed ExtensibleShape  any subclass',
            alternatives: 'final (no extension) or sealed (controlled extension)'
        },

        // Access Modifiers
        'public': {
            category: 'access',
            source: 'ANTLR',
            javaVersion: 'SE1.0',
            description: 'Public access modifier - accessible from anywhere',

            // 1. Syntactic Relationships
            followedBy: ['class', 'interface', 'enum', 'record', 'abstract', 'final', 'static', 'IDENTIFIER'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_CLOSE'],
            parentContext: ['ClassDeclaration', 'FieldDeclaration', 'MethodDeclaration', 'ConstructorDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            isModifier: true,

            // 2. Parser Directives
            isModifier: true,
            isAccessModifier: true,
            mutuallyExclusive: ['private', 'protected'],
            accessLevel: 'public',

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'public = accessible everywhere',
                    accessLevels: 'public > protected > package-private > private'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Only one public top-level class allowed per file.",
            commonTypos: ['pubilc', 'publc', 'pubic', 'publci'],
            notes: 'Broadest access. Only one public top-level class per file.',
            quirks: [
                'One public top-level class per file',
                'Filename must match public class name',
                'Cannot combine with private/protected',
                'Default for interface methods',
                'Most permissive access level'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE1.0',
            bestPractice: 'Use for APIs. Minimize public surface for encapsulation.',
            accessLevel: 'Accessible from any class in any package',
            useCases: [
                'Public APIs',
                'Entry points',
                'Library interfaces'
            ],
            example: 'public class User {}',
            accessMatrix: 'public = everywhere, protected = package + subclasses, package = package, private = class'
        },

        'private': {
            category: 'access',
            source: 'ANTLR',
            javaVersion: 'SE1.0',
            description: 'Private access modifier - accessible only within class',

            // 1. Syntactic Relationships
            followedBy: ['class', 'IDENTIFIER', 'static', 'final'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_OPEN'],
            parentContext: ['FieldDeclaration', 'MethodDeclaration', 'ConstructorDeclaration', 'InnerClassDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            isModifier: true,

            // 2. Parser Directives
            isModifier: true,
            isAccessModifier: true,
            mutuallyExclusive: ['public', 'protected'],
            mutuallyExclusiveWithAbstract: true,
            accessLevel: 'private',

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'private = accessible only within declaring class',
                    note: 'Most restrictive access level'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Private members cannot be accessed outside declaring class.",
            commonTypos: ['privte', 'pivate', 'priavte', 'privat'],
            notes: 'Most restrictive access. Cannot be abstract.',
            quirks: [
                'Most restrictive access level',
                'Cannot be abstract (contradiction)',
                'Can be applied to inner classes',
                'Not visible to subclasses',
                'Used for encapsulation'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE1.0',
            bestPractice: 'Default to private. Open up access as needed.',
            accessLevel: 'Accessible only within the same class',
            useCases: [
                'Implementation details',
                'Helper methods',
                'Internal state',
                'Encapsulation'
            ],
            example: 'private int age;',
            privateMethod: 'private void helper() {}',
            innerClass: 'private class Helper {}'
        },

        'protected': {
            category: 'access',
            source: 'ANTLR',
            javaVersion: 'SE1.0',
            description: 'Protected access modifier - package + subclasses',

            // 1. Syntactic Relationships
            followedBy: ['class', 'IDENTIFIER', 'abstract', 'static', 'final'],
            precededBy: ['NEWLINE', 'SEMICOLON', 'BRACE_OPEN'],
            parentContext: ['FieldDeclaration', 'MethodDeclaration', 'ConstructorDeclaration', 'InnerClassDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            isModifier: true,

            // 2. Parser Directives
            isModifier: true,
            isAccessModifier: true,
            mutuallyExclusive: ['public', 'private'],
            accessLevel: 'protected',

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'protected = package access + subclass access',
                    note: 'Accessible in subclasses even in different packages'
                }
            ],

            // 4. Error Reporting
            errorMessage: "Protected members accessible to subclasses and same package.",
            commonTypos: ['protcted', 'proected', 'prtoected', 'proteted'],
            notes: 'Package access plus subclass access (even across packages).',
            quirks: [
                'Accessible in same package',
                'Accessible in subclasses (any package)',
                'More permissive than package-private',
                'Less permissive than public',
                'Common for template method pattern'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE1.0',
            bestPractice: 'Use for inheritance-based APIs and template methods.',
            accessLevel: 'Accessible in same package + subclasses in any package',
            useCases: [
                'Template method pattern',
                'Hook methods',
                'Inheritance-based extension',
                'Framework design'
            ],
            example: 'protected void init() {}',
            inheritance: 'Base class protected methods accessible in derived classes',
            vsPackagePrivate: 'protected = package + subclasses, package-private = package only'
        },

        // Other Modifiers
        'static': {
            category: 'modifier',
            source: 'ANTLR',
            javaVersion: 'SE1.0',
            description: 'Static modifier - belongs to class, not instance',

            // 1. Syntactic Relationships
            followedBy: ['class', 'interface', 'IDENTIFIER', 'void', 'final'],
            precededBy: ['public', 'private', 'protected', 'NEWLINE', 'BRACE_OPEN'],
            parentContext: ['FieldDeclaration', 'MethodDeclaration', 'InnerClassDeclaration', 'InitializerBlock'],
            startsExpr: false,
            beforeExpr: false,
            isModifier: true,

            // 2. Parser Directives
            isModifier: true,
            isStatic: true,
            classLevel: true,
            noInstanceAccess: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'static = class-level, non-static = instance-level',
                    differences: [
                        'static: One copy per class',
                        'instance: One copy per object',
                        'static methods: Cannot access instance members',
                        'instance methods: Can access static members'
                    ]
                }
            ],

            // 4. Error Reporting
            errorMessage: "Static members belong to class, not instances. Cannot access instance members from static context.",
            commonTypos: ['statc', 'staic', 'sttaic', 'stati'],
            notes: 'Class-level member. No instance access. Cannot be abstract.',
            quirks: [
                'One copy shared by all instances',
                'Cannot access instance members directly',
                'Can be called without object',
                'Static initializer blocks',
                'Static imports',
                'Cannot be abstract'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE1.0',
            bestPractice: 'Use for utility methods, constants, factory methods.',
            useCases: [
                'Utility methods',
                'Constants',
                'Factory methods',
                'Singleton pattern',
                'Static initializers'
            ],
            example: 'public static final int MAX_VALUE = 100;',
            staticMethod: 'public static void main(String[] args) {}',
            staticBlock: 'static { // initialization }'
        },

        'final': {
            category: 'modifier',
            source: 'ANTLR',
            javaVersion: 'SE1.0',
            description: 'Final modifier - cannot be changed/overridden',

            // 1. Syntactic Relationships
            followedBy: ['class', 'IDENTIFIER', 'static'],
            precededBy: ['public', 'private', 'protected', 'static', 'NEWLINE'],
            parentContext: ['ClassDeclaration', 'MethodDeclaration', 'FieldDeclaration', 'ParameterDeclaration', 'LocalVariableDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            isModifier: true,

            // 2. Parser Directives
            isModifier: true,
            isFinal: true,
            preventModification: true,
            mutuallyExclusiveWithAbstract: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'final meaning depends on context',
                    contexts: [
                        'final class: Cannot be extended',
                        'final method: Cannot be overridden',
                        'final field: Cannot be reassigned (must initialize)',
                        'final variable: Cannot be reassigned',
                        'final parameter: Cannot be reassigned'
                    ]
                }
            ],

            // 4. Error Reporting
            errorMessage: "Final class cannot be extended. Final method cannot be overridden. Final variable must be initialized and cannot be reassigned.",
            commonTypos: ['fianl', 'finl', 'fnial', 'fina'],
            notes: 'Prevents modification. Context-dependent meaning (class/method/variable).',
            quirks: [
                'final class: No subclasses',
                'final method: No override',
                'final field: Must initialize, no reassignment',
                'final parameter: No reassignment',
                'final local variable: No reassignment',
                'Cannot be abstract (contradiction)'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE1.0',
            bestPractice: 'Use for immutability, preventing inheritance/override, effectively final for lambdas.',
            useCases: [
                'Immutable values',
                'Constants',
                'Preventing extension',
                'Thread safety',
                'Lambda capture'
            ],
            example: 'public final class String {}',
            finalMethod: 'public final void compute() {}',
            finalVariable: 'final int x = 10;'
        },

        'strictfp': {
            category: 'modifier',
            source: 'ANTLR',
            javaVersion: 'SE1.2',
            description: 'Strict floating-point modifier (Java 1.2+)',

            // 1. Syntactic Relationships
            followedBy: ['class', 'interface', 'IDENTIFIER'],
            precededBy: ['public', 'abstract', 'NEWLINE'],
            parentContext: ['ClassDeclaration', 'InterfaceDeclaration', 'MethodDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            isModifier: true,

            // 2. Parser Directives
            isModifier: true,
            isStrictfp: true,
            floatingPointPrecision: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'strictfp ensures consistent floating-point across platforms',
                    note: 'Deprecated in Java 17+ (default behavior)'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'strictfp' is deprecated in Java 17+. Strict floating-point is now default.",
            commonTypos: ['stricfp', 'strictp', 'stirctfp'],
            notes: 'Deprecated in Java 17+. Ensures IEEE 754 compliance.',
            quirks: [
                'Ensures IEEE 754 floating-point standard',
                'Platform-independent results',
                'Deprecated in Java 17+',
                'Now default behavior',
                'Can apply to class, interface, method'
            ],

            // 5. Complete Coverage
            stage: 'deprecated',
            deprecated: true,
            deprecatedVersion: 'SE17',
            javaVersion: 'SE1.2',
            bestPractice: 'No longer needed. Strict FP is default in Java 17+.',
            useCases: [
                'Legacy code',
                'Platform-independent floating-point (pre-Java 17)'
            ],
            example: 'strictfp class Calculator {}',
            deprecationNote: 'Deprecated in Java 17. Strict FP now default.'
        },

        'synchronized': {
            category: 'modifier',
            source: 'ANTLR',
            javaVersion: 'SE1.0',
            description: 'Synchronized modifier - thread-safe method/block',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'void', 'PAREN_OPEN'],
            precededBy: ['public', 'private', 'protected', 'static', 'NEWLINE'],
            parentContext: ['MethodDeclaration', 'Statement'],
            startsExpr: false,
            beforeExpr: false,
            isModifier: true,
            dualUsage: true,

            // 2. Parser Directives
            isModifier: true,
            isSynchronized: true,
            threadSafe: true,
            acquiresLock: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'synchronized method vs synchronized block',
                    contexts: [
                        'synchronized void method() {} // Synchronized method',
                        'synchronized(obj) { ... } // Synchronized block'
                    ]
                }
            ],

            // 4. Error Reporting
            errorMessage: "Synchronized provides thread safety but can cause performance overhead.",
            commonTypos: ['syncronized', 'sychronized', 'synchronzied', 'syncrhonized'],
            notes: 'Thread synchronization. Monitor lock on object. Performance overhead.',
            quirks: [
                'Acquires intrinsic lock',
                'synchronized method: locks this (or Class for static)',
                'synchronized block: locks specified object',
                'Can cause deadlock',
                'Performance overhead',
                'Cannot be abstract'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE1.0',
            bestPractice: 'Use for simple thread safety. Consider java.util.concurrent for complex cases.',
            useCases: [
                'Thread-safe methods',
                'Critical sections',
                'Protecting shared state',
                'Monitor pattern'
            ],
            example: 'public synchronized void increment() {}',
            synchronizedBlock: 'synchronized(lock) { count++; }',
            alternatives: 'ReentrantLock, AtomicInteger, concurrent collections'
        },

        'transient': {
            category: 'modifier',
            source: 'ANTLR',
            javaVersion: 'SE1.0',
            description: 'Transient modifier - skip serialization',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER'],
            precededBy: ['private', 'protected', 'static', 'NEWLINE'],
            parentContext: ['FieldDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            isModifier: true,

            // 2. Parser Directives
            isModifier: true,
            isTransient: true,
            skipSerialization: true,
            fieldOnly: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'transient = skip field during serialization',
                    note: 'Only for Serializable classes'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'transient' only applies to fields. Skips serialization.",
            commonTypos: ['transient', 'transeint', 'trasient', 'transiet'],
            notes: 'Serialization modifier. Field not serialized. Only for fields.',
            quirks: [
                'Only for fields',
                'Skipped during serialization',
                'Useful for derived/cached values',
                'Sensitive data (passwords)',
                'Non-serializable references',
                'static fields not serialized anyway'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE1.0',
            bestPractice: 'Use for sensitive data, caches, derived fields, non-serializable references.',
            useCases: [
                'Sensitive data (passwords)',
                'Cached/derived values',
                'Non-serializable references',
                'Temporary state'
            ],
            example: 'private transient String password;',
            serialization: 'Field excluded from serialization',
            alternatives: 'Custom serialization with writeObject/readObject'
        },

        'volatile': {
            category: 'modifier',
            source: 'ANTLR',
            javaVersion: 'SE1.0',
            description: 'Volatile modifier - thread-visible field',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER'],
            precededBy: ['private', 'protected', 'static', 'NEWLINE'],
            parentContext: ['FieldDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            isModifier: true,

            // 2. Parser Directives
            isModifier: true,
            isVolatile: true,
            threadVisible: true,
            memoryBarrier: true,
            fieldOnly: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'volatile = visibility guarantee, not atomicity',
                    note: 'Prevents caching, ensures visibility across threads'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'volatile' ensures visibility but not atomicity. Use for simple flags.",
            commonTypos: ['volatil', 'volatie', 'volaitile', 'volatlie'],
            notes: 'Memory visibility. No caching. No reordering. Not atomic for compound operations.',
            quirks: [
                'Only for fields',
                'Prevents CPU caching',
                'Ensures visibility across threads',
                'Not atomic for compound operations (++)',
                'Happens-before guarantee',
                'Cannot be final'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE1.0',
            bestPractice: 'Use for simple flags. Use AtomicInteger for counters.',
            useCases: [
                'Boolean flags',
                'Status indicators',
                'Double-checked locking',
                'Simple publisher-subscriber'
            ],
            example: 'private volatile boolean running = true;',
            notAtomic: 'volatile int count; count++; // Not atomic!',
            alternatives: 'AtomicInteger, AtomicBoolean, AtomicReference for atomic operations'
        },

        'native': {
            category: 'modifier',
            source: 'ANTLR',
            javaVersion: 'SE1.0',
            description: 'Native modifier - JNI method implementation',

            // 1. Syntactic Relationships
            followedBy: ['IDENTIFIER', 'void'],
            precededBy: ['public', 'private', 'protected', 'static', 'NEWLINE'],
            parentContext: ['MethodDeclaration'],
            startsExpr: false,
            beforeExpr: false,
            isModifier: true,

            // 2. Parser Directives
            isModifier: true,
            isNative: true,
            jniMethod: true,
            noBody: true,
            methodOnly: true,

            // 3. Disambiguation Rules
            disambiguation: [
                {
                    language: 'Java',
                    rule: 'native = implemented in C/C++ via JNI',
                    note: 'No Java method body'
                }
            ],

            // 4. Error Reporting
            errorMessage: "'native' methods have no Java body. Implemented via JNI.",
            commonTypos: ['natvie', 'natie', 'nativ', 'ntaive'],
            notes: 'JNI method. No Java implementation. Platform-dependent.',
            quirks: [
                'Only for methods',
                'No Java method body',
                'Implemented in C/C++',
                'Requires JNI',
                'Platform-dependent',
                'Cannot be abstract'
            ],

            // 5. Complete Coverage
            stage: 'stable',
            deprecated: false,
            javaVersion: 'SE1.0',
            bestPractice: 'Use sparingly. Prefer pure Java. JNI for performance-critical or system calls.',
            useCases: [
                'System calls',
                'Hardware access',
                'Legacy C/C++ libraries',
                'Performance-critical code'
            ],
            example: 'public native void nativeMethod();',
            jni: 'Implemented via Java Native Interface (JNI)',
            alternatives: 'Project Panama (Foreign Function & Memory API) for modern native access'
        },

        // Control Flow
        'if': { category: 'control', source: 'ANTLR', javaVersion: 'SE1.0' },
        'else': { category: 'control', source: 'ANTLR', javaVersion: 'SE1.0' },
        'switch': { category: 'control', source: 'ANTLR', javaVersion: 'SE1.0' },
        'case': { category: 'control', source: 'ANTLR', javaVersion: 'SE1.0' },
        'default': { category: 'control', source: 'ANTLR', javaVersion: 'SE1.0' },

        // Iteration
        'for': { category: 'iteration', source: 'ANTLR', javaVersion: 'SE1.0' },
        'while': { category: 'iteration', source: 'ANTLR', javaVersion: 'SE1.0' },
        'do': { category: 'iteration', source: 'ANTLR', javaVersion: 'SE1.0' },
        'break': { category: 'iteration', source: 'ANTLR', javaVersion: 'SE1.0' },
        'continue': { category: 'iteration', source: 'ANTLR', javaVersion: 'SE1.0' },

        // Exception Handling
        'try': { category: 'exception', source: 'ANTLR', javaVersion: 'SE1.0' },
        'catch': { category: 'exception', source: 'ANTLR', javaVersion: 'SE1.0' },
        'finally': { category: 'exception', source: 'ANTLR', javaVersion: 'SE1.0' },
        'throw': { category: 'exception', source: 'ANTLR', javaVersion: 'SE1.0' },
        'throws': { category: 'exception', source: 'ANTLR', javaVersion: 'SE1.0' },

        // Object-Oriented
        'extends': { category: 'inheritance', source: 'ANTLR', javaVersion: 'SE1.0' },
        'implements': { category: 'inheritance', source: 'ANTLR', javaVersion: 'SE1.0' },
        'new': { category: 'operator', source: 'ANTLR', javaVersion: 'SE1.0' },
        'this': { category: 'reference', source: 'ANTLR', javaVersion: 'SE1.0' },
        'super': { category: 'reference', source: 'ANTLR', javaVersion: 'SE1.0' },

        // Package & Import
        'package': { category: 'module', source: 'ANTLR', javaVersion: 'SE1.0' },
        'import': { category: 'module', source: 'ANTLR', javaVersion: 'SE1.0' },

        // Method
        'return': { category: 'control', source: 'ANTLR', javaVersion: 'SE1.0' },
        'void': { category: 'type', source: 'ANTLR', javaVersion: 'SE1.0' },

        // Assertion
        'assert': { category: 'statement', source: 'ANTLR', javaVersion: 'SE1.4' },

        // Operators
        'instanceof': { category: 'operator', source: 'ANTLR', javaVersion: 'SE1.0' },

        // Unused/Reserved
        'const': { category: 'reserved', source: 'ANTLR', javaVersion: 'SE1.0', unused: true },
        'goto': { category: 'reserved', source: 'ANTLR', javaVersion: 'SE1.0', unused: true },

        // Java 9+ Module System
        'module': { category: 'module', source: 'ANTLR', javaVersion: 'SE9', contextual: true },
        'requires': { category: 'module', source: 'ANTLR', javaVersion: 'SE9', contextual: true },
        'exports': { category: 'module', source: 'ANTLR', javaVersion: 'SE9', contextual: true },
        'opens': { category: 'module', source: 'ANTLR', javaVersion: 'SE9', contextual: true },
        'uses': { category: 'module', source: 'ANTLR', javaVersion: 'SE9', contextual: true },
        'provides': { category: 'module', source: 'ANTLR', javaVersion: 'SE9', contextual: true },
        'with': { category: 'module', source: 'ANTLR', javaVersion: 'SE9', contextual: true },
        'to': { category: 'module', source: 'ANTLR', javaVersion: 'SE9', contextual: true },
        'transitive': { category: 'module', source: 'ANTLR', javaVersion: 'SE9', contextual: true },
        'open': { category: 'module', source: 'ANTLR', javaVersion: 'SE9', contextual: true },

        // Java 10+ Local Variable Type Inference
        'var': { category: 'type', source: 'ANTLR', javaVersion: 'SE10', contextual: true },

        // Java 14+ Pattern Matching
        'yield': { category: 'control', source: 'ANTLR', javaVersion: 'SE14', contextual: true },

        // Java 16+ Records
        'permits': { category: 'modifier', source: 'ANTLR', javaVersion: 'SE17', contextual: true },
    },

    // ============================================================================
    // PRIMITIVE TYPES - ANTLR Java Lexer
    // ============================================================================
    primitiveTypes: {
        'boolean': { category: 'type', size: '1-bit', source: 'ANTLR' },
        'byte': { category: 'type', size: '8-bit', source: 'ANTLR' },
        'char': { category: 'type', size: '16-bit', source: 'ANTLR' },
        'short': { category: 'type', size: '16-bit', source: 'ANTLR' },
        'int': { category: 'type', size: '32-bit', source: 'ANTLR' },
        'long': { category: 'type', size: '64-bit', source: 'ANTLR' },
        'float': { category: 'type', size: '32-bit', source: 'ANTLR' },
        'double': { category: 'type', size: '64-bit', source: 'ANTLR' },
    },

    // ============================================================================
    // LITERALS - ANTLR Java Lexer
    // ============================================================================
    literals: {
        // Boolean Literals
        'true': { type: 'boolean', value: true, source: 'ANTLR' },
        'false': { type: 'boolean', value: false, source: 'ANTLR' },

        // Null Literal
        'null': { type: 'null', value: null, source: 'ANTLR' },

        // Integer Literals
        'decimal': { type: 'int', format: 'decimal', source: 'ANTLR' },
        'hexadecimal': { type: 'int', format: '0x', source: 'ANTLR' },
        'octal': { type: 'int', format: '0', source: 'ANTLR' },
        'binary': { type: 'int', format: '0b', source: 'ANTLR', javaVersion: 'SE7' },

        // Floating-Point Literals
        'floatLiteral': { type: 'float', suffix: 'f/F', source: 'ANTLR' },
        'doubleLiteral': { type: 'double', suffix: 'd/D', source: 'ANTLR' },

        // Character Literals
        'charLiteral': { type: 'char', format: "'...'", source: 'ANTLR' },

        // String Literals
        'stringLiteral': { type: 'string', format: '"..."', source: 'ANTLR' },
        'textBlock': { type: 'string', format: '"""...."""', source: 'ANTLR', javaVersion: 'SE15' },
    },

    // ============================================================================
    // OPERATORS - ANTLR Java Lexer
    // ============================================================================
    operators: {
        // Arithmetic Operators
        '+': { type: 'arithmetic', source: 'ANTLR' },
        '-': { type: 'arithmetic', source: 'ANTLR' },
        '*': { type: 'arithmetic', source: 'ANTLR' },
        '/': { type: 'arithmetic', source: 'ANTLR' },
        '%': { type: 'arithmetic', source: 'ANTLR' },

        // Unary Operators
        '++': { type: 'unary', source: 'ANTLR' },
        '--': { type: 'unary', source: 'ANTLR' },
        '!': { type: 'unary', source: 'ANTLR' },
        '~': { type: 'unary', source: 'ANTLR' },

        // Relational Operators
        '==': { type: 'relational', source: 'ANTLR' },
        '!=': { type: 'relational', source: 'ANTLR' },
        '<': { type: 'relational', source: 'ANTLR' },
        '>': { type: 'relational', source: 'ANTLR' },
        '<=': { type: 'relational', source: 'ANTLR' },
        '>=': { type: 'relational', source: 'ANTLR' },

        // Logical Operators
        '&&': { type: 'logical', source: 'ANTLR' },
        '||': { type: 'logical', source: 'ANTLR' },

        // Bitwise Operators
        '&': { type: 'bitwise', source: 'ANTLR' },
        '|': { type: 'bitwise', source: 'ANTLR' },
        '^': { type: 'bitwise', source: 'ANTLR' },
        '<<': { type: 'bitwise', source: 'ANTLR' },
        '>>': { type: 'bitwise', source: 'ANTLR' },
        '>>>': { type: 'bitwise', source: 'ANTLR' },

        // Assignment Operators
        '=': { type: 'assignment', source: 'ANTLR' },
        '+=': { type: 'assignment', source: 'ANTLR' },
        '-=': { type: 'assignment', source: 'ANTLR' },
        '*=': { type: 'assignment', source: 'ANTLR' },
        '/=': { type: 'assignment', source: 'ANTLR' },
        '%=': { type: 'assignment', source: 'ANTLR' },
        '&=': { type: 'assignment', source: 'ANTLR' },
        '|=': { type: 'assignment', source: 'ANTLR' },
        '^=': { type: 'assignment', source: 'ANTLR' },
        '<<=': { type: 'assignment', source: 'ANTLR' },
        '>>=': { type: 'assignment', source: 'ANTLR' },
        '>>>=': { type: 'assignment', source: 'ANTLR' },

        // Ternary Operator
        '?': { type: 'ternary', source: 'ANTLR' },
        ':': { type: 'ternary', source: 'ANTLR' },

        // Method Reference (Java 8+)
        '::': { type: 'reference', source: 'ANTLR', javaVersion: 'SE8' },

        // Lambda Arrow (Java 8+)
        '->': { type: 'lambda', source: 'ANTLR', javaVersion: 'SE8' },

        // Annotation
        '@': { type: 'annotation', source: 'ANTLR', javaVersion: 'SE5' },

        // Varargs (Java 5+)
        '...': { type: 'varargs', source: 'ANTLR', javaVersion: 'SE5' },
    },

    // ============================================================================
    // SEPARATORS - ANTLR Java Lexer
    // ============================================================================
    separators: {
        '(': { type: 'paren', pair: ')', source: 'ANTLR' },
        ')': { type: 'paren', pair: '(', source: 'ANTLR' },
        '{': { type: 'brace', pair: '}', source: 'ANTLR' },
        '}': { type: 'brace', pair: '{', source: 'ANTLR' },
        '[': { type: 'bracket', pair: ']', source: 'ANTLR' },
        ']': { type: 'bracket', pair: '[', source: 'ANTLR' },
        ';': { type: 'delimiter', name: 'semicolon', source: 'ANTLR' },
        ',': { type: 'delimiter', name: 'comma', source: 'ANTLR' },
        '.': { type: 'accessor', name: 'dot', source: 'ANTLR' },
    },

    // ============================================================================
    // ANNOTATIONS - Java SE 5+
    // ============================================================================
    annotations: {
        // Built-in Annotations
        '@Override': { target: 'METHOD', source: 'ANTLR', javaVersion: 'SE5' },
        '@Deprecated': { target: 'ALL', source: 'ANTLR', javaVersion: 'SE5' },
        '@SuppressWarnings': { target: 'ALL', source: 'ANTLR', javaVersion: 'SE5' },
        '@SafeVarargs': { target: 'METHOD,CONSTRUCTOR', source: 'ANTLR', javaVersion: 'SE7' },
        '@FunctionalInterface': { target: 'TYPE', source: 'ANTLR', javaVersion: 'SE8' },

        // Meta-Annotations
        '@Retention': { target: 'ANNOTATION_TYPE', source: 'ANTLR', javaVersion: 'SE5' },
        '@Target': { target: 'ANNOTATION_TYPE', source: 'ANTLR', javaVersion: 'SE5' },
        '@Documented': { target: 'ANNOTATION_TYPE', source: 'ANTLR', javaVersion: 'SE5' },
        '@Inherited': { target: 'ANNOTATION_TYPE', source: 'ANTLR', javaVersion: 'SE5' },
        '@Repeatable': { target: 'ANNOTATION_TYPE', source: 'ANTLR', javaVersion: 'SE8' },
    },

    // ============================================================================
    // GENERICS - Java SE 5+
    // ============================================================================
    generics: {
        '<': { type: 'generic', name: 'type-parameter-start', source: 'ANTLR', javaVersion: 'SE5' },
        '>': { type: 'generic', name: 'type-parameter-end', source: 'ANTLR', javaVersion: 'SE5' },
        '?': { type: 'wildcard', name: 'type-wildcard', source: 'ANTLR', javaVersion: 'SE5' },
        'extends': { type: 'bound', name: 'upper-bound', source: 'ANTLR', javaVersion: 'SE5' },
        'super': { type: 'bound', name: 'lower-bound', source: 'ANTLR', javaVersion: 'SE5' },
    },
};

// Export ทั้ง grammar และ metadata
export default JAVA_GRAMMAR;
