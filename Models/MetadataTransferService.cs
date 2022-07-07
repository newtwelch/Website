using System.ComponentModel;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Routing;

namespace Website.Models
{
    public class MetadataTransferService : INotifyPropertyChanged, IDisposable
    {
        private readonly NavigationManager _navigationManager;
        public event PropertyChangedEventHandler PropertyChanged;
        private List<MetadataValue> MetadataValues {get; set;}

        private string _title;

        public string Title
        {
            get => _title;
            set
            {
                _title = value;
                OnPropertyChanged();
            }
        }

        private string _description;

        public string Description
        {
            get => _description;
            set
            {
                _description = value;
                OnPropertyChanged();
            }
        }

        private string _ogTitle;

        public string OgTitle
        {
            get => _ogTitle;
            set
            {
                _ogTitle = value;
                OnPropertyChanged();
            }
        }
        private string _ogImage;

        public string OgImage
        {
            get => _ogImage;
            set
            {
                _ogImage = value;
                OnPropertyChanged();
            }
        }
        
        private string _twitterCard;

        public string TwitterCard
        {
            get => _twitterCard;
            set
            {
                _twitterCard = value;
                OnPropertyChanged();
            }
        }

        public void OnPropertyChanged([CallerMemberName] string propertyName = null) => PropertyChanged?.Invoke(this, new(propertyName));
        

        public MetadataTransferService(NavigationManager navigationManager)
        {
            LoadMetadataValues();
            _navigationManager = navigationManager;

            // Susbscribe to the location changed event
            _navigationManager.LocationChanged += UpdateMetadata;

            // Initial Call
            UpdateMetadata(_navigationManager.Uri);
        }
        private void UpdateMetadata(object sender, LocationChangedEventArgs e) => UpdateMetadata(e.Location);
        

        private void UpdateMetadata(string url)
        {
            var metadataValue = MetadataValues.FirstOrDefault(mv => url.EndsWith(mv.Url));

            if (metadataValue is null)
            {
                metadataValue = new()
                {
                    Title = "Default",
                    Description = "Default"
                };
            }

            Title = metadataValue.Title ?? throw new ArgumentNullException(nameof(metadataValue.Title));
            Description = metadataValue.Description ?? throw new ArgumentNullException(nameof(MetadataValue.Description));
            OgTitle = metadataValue.OgTitle ?? throw new ArgumentNullException(nameof(metadataValue.OgTitle));
            TwitterCard = metadataValue.TwitterCard ?? throw new ArgumentNullException(nameof(metadataValue.TwitterCard));
        }

        private void LoadMetadataValues()
        {
            MetadataValues = new List<MetadataValue>();

            MetadataValues.Add(
                new()
                {
                    Url = "/",
                    Title = "Home - Newt Welch",
                    Description = "The finest graphic design portfolio by Newt Welch the Space Pirate",
                    OgTitle = "Home of Newt Welch's Portfolio",
                    TwitterCard = "Newt Welch - Graphic Design Portfolio"
                });
        }
    
        public void Dispose()
        {
            // Unsubscribe the events
            _navigationManager.LocationChanged -= UpdateMetadata;
        }
    }

    public class MetadataValue
    {
        public string Url { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string OgTitle { get; set; }
        public string OgImage { get; set; }
        public string TwitterCard { get; set; }
    }
}