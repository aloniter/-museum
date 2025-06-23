using UnityEngine;

namespace VRMuseum.Core
{
    /// <summary>
    /// Scriptable Object that defines the configuration for a themed museum room.
    /// Contains all the settings needed to create an immersive environment.
    /// </summary>
    [CreateAssetMenu(fileName = "New Theme Config", menuName = "VR Museum/Theme Config")]
    public class ThemeConfig : ScriptableObject
    {
        [Header("Basic Information")]
        public string theme_name = "New Theme";
        [TextArea(3, 5)]
        public string description = "Description of this themed environment";
        
        [Header("Visual Environment")]
        public GameObject environment_prefab;
        public Material skybox_material;
        public Color ambient_light_color = Color.white;
        [Range(0f, 2f)]
        public float ambient_light_intensity = 1f;
        
        [Header("Photo Display")]
        public string photos_folder_name = "Default";
        public GameObject photo_frame_prefab;
        public PhotoDisplayStyle display_style = PhotoDisplayStyle.WallMounted;
        [Range(1f, 5f)]
        public float photo_spacing = 2f;
        public Vector3 photo_display_area_size = new Vector3(10f, 3f, 10f);
        
        [Header("Audio")]
        public AudioClip ambient_audio_clip;
        [Range(0f, 1f)]
        public float ambient_volume = 0.5f;
        public AudioClip[] interaction_sounds;
        
        [Header("Lighting")]
        public Light directional_light_settings;
        public GameObject[] additional_light_prefabs;
        
        [Header("Atmosphere")]
        public ParticleSystem[] particle_effects;
        public AnimationClip[] ambient_animations;
        
        [Header("Interactive Elements")]
        public GameObject[] interactive_objects;
        public Transform[] photo_spawn_points;
        
        /// <summary>
        /// Get the full path to the photos folder for this theme
        /// </summary>
        public string GetPhotosPath()
        {
            return $"Photos/{photos_folder_name}";
        }
        
        /// <summary>
        /// Validate the theme configuration and log any missing components
        /// </summary>
        public bool ValidateConfig()
        {
            bool is_valid = true;
            
            if (string.IsNullOrEmpty(theme_name))
            {
                Debug.LogError($"Theme Config: theme_name is required!");
                is_valid = false;
            }
            
            if (environment_prefab == null)
            {
                Debug.LogWarning($"Theme Config '{theme_name}': No environment_prefab assigned. Will use default environment.");
            }
            
            if (photo_frame_prefab == null)
            {
                Debug.LogError($"Theme Config '{theme_name}': photo_frame_prefab is required!");
                is_valid = false;
            }
            
            if (string.IsNullOrEmpty(photos_folder_name))
            {
                Debug.LogError($"Theme Config '{theme_name}': photos_folder_name is required!");
                is_valid = false;
            }
            
            return is_valid;
        }
    }
    
    /// <summary>
    /// Defines how photos should be displayed in the environment
    /// </summary>
    public enum PhotoDisplayStyle
    {
        WallMounted,     // Photos mounted on walls like traditional gallery
        Floating,        // Photos floating in space
        Pedestal,        // Photos on pedestals/stands
        Hanging,         // Photos hanging from ceiling/trees
        Scattered,       // Photos scattered around the environment
        Circular         // Photos arranged in a circle around player
    }
} 